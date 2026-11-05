// Web Request/Response adapter. Use trusted server-side identity and ownership.
export function guardRoute(guardian, { getIdentity, resolveResourceOwner, action, timeoutMs = 2000 }, handler) {
  if (!guardian || typeof guardian.authorize !== 'function' || typeof guardian.record !== 'function' ||
      ![getIdentity, resolveResourceOwner, handler].every(f => typeof f === 'function') ||
      typeof action !== 'string' || !action.trim() || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000)
    throw new TypeError('Guardian, trusted resolvers, fixed action, handler and bounded timeout required');
  const deny = status => new Response(JSON.stringify({ error: status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Security check unavailable' }), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
  return async (request, context) => {
    const controller = new AbortController();
    let timer;
    const active = () => { if (controller.signal.aborted) throw new Error('Security deadline expired'); };
    const check = async () => {
      const identity = await getIdentity(request, context, controller.signal);
      active();
      if (typeof identity?.actorId !== 'string' || !identity.actorId.trim() || typeof identity?.role !== 'string' || !identity.role.trim()) {
        await guardian.record('authorization_denied', { outcome: 'unauthenticated' });
        active(); return 401;
      }
      const owner = await resolveResourceOwner(request, context, controller.signal);
      active();
      const decision = await guardian.authorize({ actorId: identity.actorId, role: identity.role, action, resourceOwnerId: owner });
      active();
      if (decision?.allowed !== true) return 403;
      await guardian.record('authorization_granted', { actorId: identity.actorId, action, outcome: 'allowed' });
      active(); return 200;
    };
    let status;
    try {
      status = await Promise.race([check(), new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error('Security deadline expired')); }, timeoutMs);
      })]);
    } catch {
      // Never retry a failed sink or expose its raw error.
      return deny(503);
    } finally { clearTimeout(timer); }
    if (status !== 200) return deny(status);
    // Business errors remain the application's responsibility.
    return handler(request, context);
  };
}
