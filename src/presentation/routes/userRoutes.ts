import { Router } from 'express';
import { upload } from '../../config/multerConfig';
import { authMiddleware } from '../middleware/authMiddleware';
import { userController } from '../controllers/userController';

const router = Router();

router.get('/chat/admins', authMiddleware, userController.getAdminsForChatSidebar);

router.patch('/prfileImage', authMiddleware, upload.single("profileImage"), userController.updateUserProfileImage );

router.get("/testimonials", authMiddleware, userController.getTestimonilas );

export default router;

