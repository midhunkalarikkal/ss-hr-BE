import { Request, Response } from 'express';
import { AuthUseCases } from '../../domain/use-cases/AuthUseCases';
import { userValidationSchema, loginValidationSchema } from '../../domain/entities/User';

export class AuthController {
  constructor(private authUseCases: AuthUseCases) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = userValidationSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(detail => detail.message),
        });
        return;
      }
      const userData = {
        fullName: value.fullName,  
        email: value.email,
        password: value.password,
        role: value.role || 'user',
      };


      const result = await this.authUseCases.register(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message === 'User already exists with this email') {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = loginValidationSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(detail => detail.message),
        });
        return;
      }

      const result = await this.authUseCases.login({
        email: value.email,
        password: value.password,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid email or password' || 
          error.message === 'Account is deactivated. Please contact support.') {
        res.status(401).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
      });
    }
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
      });
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'No token provided',
        });
        return;
      }

      const token = authHeader.substring(7); 
      const user = await this.authUseCases.verifyToken(token);

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: {
          user,
        },
      });
    } catch (error: any) {
      console.error('Token verification error:', error);
      
      if (error.message === 'Invalid or expired token' || 
          error.message === 'Account is deactivated') {
        res.status(401).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
      });
    }
  };
}