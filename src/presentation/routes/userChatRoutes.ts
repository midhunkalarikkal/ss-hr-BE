import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { userController } from '../controllers/userController';

const router = Router();

router.get('/admins', authMiddleware, userController.getAdminsForChatSidebar);

export default router;

