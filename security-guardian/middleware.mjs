// Integration adapter. The host must provide authenticated identity from a trusted session.
// Never trust role or actorId from HTTP request bodies, query parameters, or AI output.
export function guardianMiddleware(guardian, { getIdentity, resolveResourceOwner, actionForRequest }) {
  if (!guardian || ![getIdentity, resolveResourceOwner, actionForRequest].every(f => typeof f === 'function')) {
    throw new TypeError('Guardian and three integration callbacks required');
  }
  return async (req, res, next) => {
    try {
      const identity = await getIdentity(req);
      if (!identity?.actorId || !identity?.role) {
        guardian.record('authorization_denied', { outcome: 'unauthenticated' });
        res.statusCode = 401;
        return res.end('Unauthorized');
      }
      const action = await actionForRequest(req);
      const owner = await resolveResourceOwner(req);
      if (!action || !guardian.authorize({
        actorId: identity.actorId,
        role: identity.role,
        action,
        resourceOwnerId: owner
      }).allowed) {
        res.statusCode = 403;
        return res.end('Forbidden');
      }
      return next();
    } catch {
      guardian.record('authorization_denied', { outcome: 'error' });
      res.statusCode = 503;
      return res.end('Security check unavailable');
    }
  };
}
