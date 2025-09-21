import {Router} from "express"
import { authMiddleware } from '../middleware/authMiddleware';
import { adminUserController } from "../controllers/adminUserController";

const router = Router();

router.post('/', authMiddleware, adminUserController.createUser);
router.get('/', authMiddleware, adminUserController.getAllUsers);
router.get('/stats', authMiddleware, adminUserController.getUserStats);
router.get('/:id', authMiddleware, adminUserController.getUserById);
router.put('/:id', authMiddleware, adminUserController.updateUser);
router.delete('/:id', authMiddleware, adminUserController.deleteUser);

export default router;