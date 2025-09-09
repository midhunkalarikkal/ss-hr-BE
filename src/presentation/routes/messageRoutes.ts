import multer from 'multer';
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { messageController } from '../controllers/messageController';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get('/:toUserId',authMiddleware, messageController.getMessages);

router.post('/send/:toUserId',authMiddleware, upload.single("messageImage"), messageController.sendMessage);

export default router;