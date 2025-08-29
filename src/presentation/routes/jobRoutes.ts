import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { jobController } from '../controllers/jobController';

const router = Router();


router.use(authMiddleware);


router.post('/jobs', jobController.createJob);           
router.get('/jobs/:id', jobController.getJobById);      
router.put('/jobs/:id', jobController.updateJob);        
router.delete('/jobs/:id', jobController.deleteJob);    

export default router;