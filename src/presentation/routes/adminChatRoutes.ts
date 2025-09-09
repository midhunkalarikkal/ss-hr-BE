import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminController } from '../controllers/adminController';

const router = Router();

router.get('/users', authMiddleware, adminController.getAllUsersForChatSidebar);

export default router;