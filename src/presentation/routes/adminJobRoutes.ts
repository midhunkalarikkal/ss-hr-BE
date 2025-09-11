import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminJobController } from '../controllers/adminJobController';

const router = Router();

router.post('/',authMiddleware, adminJobController.createJob);          
router.get('/',authMiddleware, adminJobController.getAllJobs);           
router.get('/:id',authMiddleware, adminJobController.getJobById);       
router.put('/:id',authMiddleware, adminJobController.updateJob);       
router.delete('/:id',authMiddleware, adminJobController.deleteJob); 

export default router;