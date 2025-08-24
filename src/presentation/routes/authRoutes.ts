import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { authController } from '../controllers/authController';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resendOtp', authController.resendOtp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// router.post('/updatePassword', authController.logout);
router.get('/checkUserStatus',authMiddleware, authController.checkUserStatus);

export default router;