import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
export function requestId(req, _res, next) {
    req.requestId = randomUUID();
    if (env.DEPURACION === 1)
        console.log('[1] requestId', req.requestId);
    next();
}
//# sourceMappingURL=requestId.js.map