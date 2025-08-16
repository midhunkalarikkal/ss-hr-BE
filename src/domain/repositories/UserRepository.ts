import type { User,UpdateUserData } from '../entities/User';

export interface UserRepository {
  create(userData: Omit<User, '_id'>): Promise<User>;

  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByRole(role: string): Promise<User[]>;
  countUsers(): Promise<number>;

  updateById(id: string, updateData: UpdateUserData): Promise<User | null>;
  update(id: string, updateData: UpdateUserData): Promise<User | null>; 

  deleteById(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}