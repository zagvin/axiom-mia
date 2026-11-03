import { createHash } from 'node:crypto';

const DEFAULTS = Object.freeze({ windowMs: 60_000, maxAttempts: 5, lockMs: 15 * 60_000 });
const suspicious = [/ignore (all )?(previous|prior) instructions/i, /reveal (the )?(system prompt|secret|api key)/i, /disable (audit|security|logging)/i];

export class SecurityGuardian {
  constructor({ audit, now = () => Date.now(), config = {} } = {}) {
    if (typeof audit !== 'function') throw new TypeError('An audit sink is required');
    this.audit = audit;
    this.now = now;
    this.config = { ...DEFAULTS, ...config };
    this.attempts = new Map();
  }

  async record(type, metadata = {}) {
    const allowed = ['actorId', 'resource', 'action', 'outcome', 'reason'];
    const safe = Object.fromEntries(allowed.filter(k => typeof metadata[k] === 'string').map(k => [k, metadata[k].slice(0, 128)]));
    await this.audit({ at: new Date(this.now()).toISOString(), type, ...safe });
  }

  checkLogin(actorId) {
    if (!actorId || typeof actorId !== 'string') return { allowed: false, reason: 'invalid_actor' };
    const state = this.attempts.get(actorId);
    if (state?.lockedUntil > this.now()) return { allowed: false, reason: 'temporarily_locked' };
    return { allowed: true };
  }

  async loginResult(actorId, success) {
    if (!actorId || typeof actorId !== 'string') throw new TypeError('actorId required');
    if (!this.checkLogin(actorId).allowed) return { allowed: false, reason: 'temporarily_locked' };
    if (success) {
      this.attempts.delete(actorId);
      await this.record('authentication', { actorId, outcome: 'success' });
      return { allowed: true };
    }
    const t = this.now(), old = this.attempts.get(actorId);
    const count = old && t - old.started < this.config.windowMs ? old.count + 1 : 1;
    const started = old && t - old.started < this.config.windowMs ? old.started : t;
    const lockedUntil = count >= this.config.maxAttempts ? t + this.config.lockMs : 0;
    this.attempts.set(actorId, { count, started, lockedUntil });
    await this.record('authentication', { actorId, outcome: 'failure' });
    return { allowed: false, reason: lockedUntil ? 'temporarily_locked' : 'invalid_credentials' };
  }

  async authorize({ actorId, role, action, resourceOwnerId }) {
    const permissions = {
      physician: ['read_patient', 'write_note', 'approve_note', 'schedule', 'view_audit'],
      staff: ['read_patient', 'schedule'],
      billing: ['read_billing', 'prepare_claim'],
      service: ['route_task']
    };
    const allowed = Boolean(typeof actorId === 'string' && actorId.trim().length > 0 && Object.hasOwn(permissions, role) && permissions[role].includes(action) &&
      (typeof resourceOwnerId === 'string' && resourceOwnerId.trim().length > 0 && actorId === resourceOwnerId));
    if (!allowed) await this.record('authorization_denied', { actorId: String(actorId || ''), action: String(action || '') });
    return { allowed };
  }

  async inspectUntrustedText(value) {
    if (typeof value !== 'string') return { suspicious: true, reason: 'invalid_input' };
    const flagged = suspicious.some(pattern => pattern.test(value));
    if (flagged) await this.record('prompt_injection_signal', { outcome: 'flagged' });
    return { suspicious: flagged, reason: flagged ? 'instruction_like_content' : null };
  }
}

export function hashAuditEvent(event) {
  return createHash('sha256').update(JSON.stringify(event)).digest('hex');
}
