import { auth } from '../firebase/admin.js';
import { sendError } from '../utils/responseHelper.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Unauthorized: No token provided', null, 401);
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
       return sendError(res, 'Unauthorized: Token expired', null, 401);
    }
    return sendError(res, 'Forbidden: Invalid token', null, 403);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.admin === true) {
    next();
  } else {
    return sendError(res, 'Forbidden: Admin access required', null, 403);
  }
};
