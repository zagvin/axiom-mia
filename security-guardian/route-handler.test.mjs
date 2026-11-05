import test from 'node:test';
import assert from 'node:assert/strict';
import { SecurityGuardian } from './guardian.mjs';
import { guardRoute } from './route-handler.mjs';
const options={getIdentity:()=>({actorId:'doc',role:'physician'}),resolveResourceOwner:()=> 'doc',action:'read_patient'};
const request=()=>new Request('http://localhost:3030/api/visits/example');
function setup(overrides={},audit=()=>{}) {
 let calls=0;const wrapped=guardRoute(new SecurityGuardian({audit}),{...options,...overrides},()=>{calls++;return new Response('synthetic')});return {wrapped,calls:()=>calls};
}
test('forwards request and promised params after successful audit',async()=>{
 const events=[];const req=request(),ctx={params:Promise.resolve({id:'example'})};
 const wrapped=guardRoute(new SecurityGuardian({audit:async e=>events.push(e)}),options,(r,c)=>{assert.equal(r,req);assert.equal(c,ctx);assert.equal(events[0].type,'authorization_granted');return new Response('ok')});
 assert.equal(await (await wrapped(req,ctx)).text(),'ok');
});
for(const [name,overrides,status] of [
 ['missing identity',{getIdentity:()=>null},401],['missing owner',{resolveResourceOwner:()=>null},403],
 ['foreign owner',{resolveResourceOwner:()=> 'other'},403],['wrong role',{getIdentity:()=>({actorId:'doc',role:'billing'})},403],
 ['resolver failure',{getIdentity:()=>{throw Error('private error')}},503]
])test(name,async()=>{const s=setup(overrides),r=await s.wrapped(request(),{});assert.equal(r.status,status);assert.equal(s.calls(),0);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal((await r.text()).includes('private error'),false)});
for(const audit of [()=>{throw Error('sink')},async()=>{throw Error('sink')},()=>new Promise(()=>{})])test('audit outage prevents handler '+audit.constructor.name,async()=>{const s=setup({timeoutMs:20},audit);assert.equal((await s.wrapped(request(),{})).status,503);assert.equal(s.calls(),0)});
test('late identity cannot execute after deadline',async()=>{
 let release,ownerCalls=0;const s=setup({timeoutMs:20,getIdentity:()=>new Promise(r=>{release=r}),resolveResourceOwner:()=>{ownerCalls++;return 'doc'}});
 assert.equal((await s.wrapped(request(),{})).status,503);release({actorId:'doc',role:'physician'});await new Promise(r=>setImmediate(r));assert.equal(s.calls(),0);assert.equal(ownerCalls,0);
});
test('client claims cannot replace trusted identity',async()=>{const s=setup({getIdentity:()=>null});const req=new Request('http://localhost:3030/api/visits/example?role=physician',{headers:{'x-actor-id':'doc','x-role':'physician'}});assert.equal((await s.wrapped(req,{})).status,401);assert.equal(s.calls(),0)});
test('business errors propagate',async()=>{const error=Error('business');const wrapped=guardRoute(new SecurityGuardian({audit:()=>{}}),options,async()=>{throw error});await assert.rejects(wrapped(request(),{}),e=>e===error)});
test('invalid configuration rejected',()=>{for(const bad of [{timeoutMs:0},{timeoutMs:Infinity},{action:''}])assert.throws(()=>guardRoute(new SecurityGuardian({audit:()=>{}}),{...options,...bad},()=>{}),TypeError)});
