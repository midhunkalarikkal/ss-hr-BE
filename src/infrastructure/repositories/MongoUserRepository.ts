import type { User, UpdateUserData } from '../../domain/entities/User';
import type { UserRepository } from '../../domain/repositories/UserRepository';
import { UserModel } from '../database/models/UserModel';

export class MongoUserRepository implements UserRepository {
  async create(userData: Omit<User, '_id'>): Promise<User> {
    try {
      const userDoc = new UserModel(userData);
      const savedDoc = await userDoc.save();
      return this.mapToEntity(savedDoc);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('User already exists with this email');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findById(id);
      return userDoc ? this.mapToEntity(userDoc) : null;
    } catch (error: any) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
      return userDoc ? this.mapToEntity(userDoc) : null;
    } catch (error: any) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const userDocs = await UserModel.find({});
      return userDocs.map(doc => this.mapToEntity(doc));
    } catch (error: any) {
      throw new Error(`Failed to find users: ${error.message}`);
    }
  }

  async updateById(id: string, updateData: UpdateUserData): Promise<User | null> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      return userDoc ? this.mapToEntity(userDoc) : null;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Alias method for updateById (required by interface)
  async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    return this.updateById(id, updateData);
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return !!result;
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Alias method for deleteById (required by interface)
  async delete(id: string): Promise<boolean> {
    return this.deleteById(id);
  }

  async findByRole(role: string): Promise<User[]> {
    try {
      const userDocs = await UserModel.find({ role });
      return userDocs.map(doc => this.mapToEntity(doc));
    } catch (error: any) {
      throw new Error(`Failed to find users by role: ${error.message}`);
    }
  }

  async countUsers(): Promise<number> {
    try {
      return await UserModel.countDocuments();
    } catch (error: any) {
      throw new Error(`Failed to count users: ${error.message}`);
    }
  }

  private mapToEntity(userDoc: any): User {
    return {
      _id: userDoc._id.toString(),
      fullName: userDoc.fullName,
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role,
      isVerified: userDoc.isVerified,
      isActive: userDoc.isActive !== undefined ? userDoc.isActive : true, 
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }
}