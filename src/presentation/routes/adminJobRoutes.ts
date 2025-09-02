import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminJobController } from '../controllers/adminJobController';

const router = Router();

router.get('/',authMiddleware, adminJobController.getAllJobs);           
router.post('/',authMiddleware, adminJobController.createJob);          
router.put('/:id',authMiddleware, adminJobController.updateJob);       
router.get('/:id',authMiddleware, adminJobController.getJobById);       
router.delete('/:id',authMiddleware, adminJobController.deleteJob); 

export default router;