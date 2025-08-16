import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthUseCases } from '../../domain/use-cases/AuthUseCases';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository';

const router = Router();


const userRepository = new MongoUserRepository();
const authUseCases = new AuthUseCases(userRepository);
const authController = new AuthController(authUseCases);


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authController.verifyToken);

export default router;