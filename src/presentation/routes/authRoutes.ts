import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { authController } from '../controllers/authController';
import passport from '../../infrastructure/auth/passport';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resendOtp', authController.resendOtp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// router.post('/updatePassword', authController.logout);
router.get('/checkUserStatus',authMiddleware, authController.checkUserStatus);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),authController.googleCallback);


export default router;