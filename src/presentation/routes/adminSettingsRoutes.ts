import { Router } from 'express';
import { upload } from '../../config/multerConfig';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminSettingsController } from '../controllers/adminSettingsController';

const router = Router();

router.post('/admins', authMiddleware, upload.single('profileImage'), adminSettingsController.createNewAdmin);
router.get('/admins', authMiddleware, adminSettingsController.getAllAdmins);

// router.patch('/admins/:id', authMiddleware, adminController); update a single admin including blocking
// router.delete('/admins/:id', authMiddleware, adminController); delete a specific admin

export default router;