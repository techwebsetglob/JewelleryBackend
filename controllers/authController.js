import { auth } from '../firebase/admin.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getMe = async (req, res, next) => {
  try {
    // The user information is already attached to req.user by the verifyToken middleware
    return sendSuccess(res, 'User info fetched successfully', req.user);
  } catch (error) {
    next(error);
  }
};

export const setAdminLogic = async (req, res, next) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return sendError(res, 'User ID (uid) is required', null, 400);
    }

    // Set custom user claims
    await auth.setCustomUserClaims(uid, { admin: true });
    
    return sendSuccess(res, `Admin claim set successfully for user ${uid}`);
  } catch (error) {
    next(error);
  }
};
