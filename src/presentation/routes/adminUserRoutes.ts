import {Router} from "express"
import { authMiddleware } from '../middleware/authMiddleware';
import { userController } from '../controllers/userController';

const router = Router();


router.post('/', authMiddleware, userController.createUser);
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/stats', authMiddleware, userController.getUserStats);
router.get('/chat-sidebar', authMiddleware, userController.getAdminsForChatSidebar);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;