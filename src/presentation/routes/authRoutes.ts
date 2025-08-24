import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

router.post('/register', authController.register);
// router.post('/verify-otp', authController.register);
// router.post('/login',authMiddleware, authController.login);
// router.post('/logout', authController.logout);
// router.post('/resendOtp', authController.logout);
// router.post('/updatePassword', authController.logout);
// router.get('/checkUserStatus', authController.verifyToken);

export default router;