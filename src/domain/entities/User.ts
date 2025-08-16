import Joi from 'joi';

export interface User {
  _id?: string;
  fullName: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'hr'
  isVerified: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'hr';
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin' | 'hr';
  isVerified?: boolean;
  isActive?: boolean;
}

export const userValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('user', 'admin', 'hr').default('user'),
  isVerified: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


