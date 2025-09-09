import { Router } from 'express';
import { upload } from '../../config/multerConfig';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminController } from '../controllers/adminController';

const router = Router();

router.post('/admins', authMiddleware, upload.single('profileImage'), adminController.createNewAdmin);
// router.get('/admins', authMiddleware, adminController); get all admmins
// router.patch('/admins/:id', authMiddleware, adminController); update a single admin including blocking
// router.delete('/admins/:id', authMiddleware, adminController); delete a specific admin

export default router;