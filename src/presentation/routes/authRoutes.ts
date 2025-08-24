import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resendOtp', authController.resendOtp);
router.post('/login', authController.login);
// router.post('/logout', authController.logout);
// router.post('/updatePassword', authController.logout);
// router.get('/checkUserStatus', authController.verifyToken);

export default router;