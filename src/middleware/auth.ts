import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const excludeEndpoints = new Set();
const ADMIN_SECRET = process.env.ADMIN_SECRET;
/**
 * Express Middleware function that intercepts requests and checks for
 * a Json Web Token. Expects a header of the following format:
 *   Authorization: Bearer <JWT>
 * Responds with an AuthError if it doesn't exist.
 *
 * If the endpoint is the auth endpoint where clients request for tokens,
 * the function allows the request to pass through.
 *
 */
async function authJwt(req: Request, res: Response, next: NextFunction) {

  if (req.path !== '/' && req.path !== '/ping') {
    // Don't pollute logs with health check calls
    // console.log('Requested ' + req.path);
  }

  if (excludeEndpoints.has(req.path) || req.headers.adminsecret === ADMIN_SECRET) {
    next();
  } else if (!req.headers.authorization) {
    // Client is requesting for a resource -- check for JWT.
    console.log(`[AuthError] Client requested for resource ${req.path} without auth header`);
    res.status(400).send({ error: 'Unauthorized' });
  } else {

    // Protected endpoints

    const authHeader = req.headers.authorization;

    if (!authHeader.startsWith('Bearer ')) {
      console.log('[AuthError] Malformed authorization header');
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    if (jwt.verify(token, ADMIN_SECRET as string)) {
      next();
    } else {
      console.log(`[AuthError] Jwt provided by client is invalid: ${token}`);
      res.status(403).json({ error: 'Unauthorized' });
    }
  }
}

function _export(options: { exclude: string[] }) {

  const { exclude } = options;

  for (const endpoint of exclude) {
    excludeEndpoints.add(endpoint);
  }

  return authJwt;
}

export default _export;