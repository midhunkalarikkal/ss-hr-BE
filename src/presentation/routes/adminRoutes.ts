import { Router } from 'express';
import { upload } from '../../config/multerConfig';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminSettingsController } from '../controllers/adminSettingsController';

const router = Router();

router.post('/createAdmin', authMiddleware, upload.single('profileImage'), adminSettingsController.createNewAdmin);

export default router;