import { Router } from 'express';
import { upload } from '../../config/multerConfig';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminSettingsController } from '../controllers/adminSettingsController';

const router = Router();

router.post('/admins', authMiddleware, upload.single('profileImage'), adminSettingsController.createNewAdmin);
router.get('/admins', authMiddleware, adminSettingsController.getAllAdmins);
router.delete('/:id', authMiddleware, adminSettingsController.deleteAdmin);

export default router;