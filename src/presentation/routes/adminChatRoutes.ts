import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminUserController } from '../controllers/adminUserController';

const router = Router();

router.get('/users', authMiddleware, adminUserController.getAllUsersForChatSidebar);

export default router;