import type { User, CreateUserData } from "../entities/User";
import type { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, "password">;
  token: string;
}

export class AuthUseCases {
  constructor(private userRepository: UserRepository) {}

  private readonly ADMIN_CREDENTIALS = {
    email: process.env['ADMIN_EMAIL'] || "admin@sshrconsultancy.com",
    password: process.env['ADMIN_PASSWORD'] || "Admin123!@#",
    user: {
      _id: "admin-fixed-id",
      fullName: "System Administrator",
      email: process.env['ADMIN_EMAIL'] || "admin@sshrconsultancy.com",
      role: "admin" as const,
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  async register(userData: CreateUserData): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const newUser: Omit<User, "_id"> = {
      fullName: userData.fullName,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user",
      isVerified: false,
      isActive: true,
    };

    const createdUser = await this.userRepository.create(newUser);
    const token = this.generateToken(
      createdUser._id!,
      createdUser.email,
      createdUser.role
    );
    const { password, ...userWithoutPassword } = createdUser;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      if (credentials.email === this.ADMIN_CREDENTIALS.email) {
        return await this.adminLogin(credentials.email, credentials.password);
      }

      return await this.regularUserLogin(credentials);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }

  private async adminLogin(email: string, password: string): Promise<AuthResult> {
     console.log('Admin login - email check:', email === this.ADMIN_CREDENTIALS.email);
    console.log('Admin login - password check:', password === this.ADMIN_CREDENTIALS.password);
    console.log('Expected admin password:', this.ADMIN_CREDENTIALS.password);
    console.log('Provided password:', password);
    if (email !== this.ADMIN_CREDENTIALS.email || password !== this.ADMIN_CREDENTIALS.password) {
      throw new Error('Invalid admin credentials');
    }

    const token = jwt.sign(
      {
        userId: this.ADMIN_CREDENTIALS.user._id,
        email: this.ADMIN_CREDENTIALS.user.email,
        role: this.ADMIN_CREDENTIALS.user.role
      },
      process.env['JWT_SECRET']!,
      { 
        expiresIn: (process.env['JWT_EXPIRES_IN'] || '7d') as string
      } as SignOptions
    );

    const { ...userWithoutPassword } = this.ADMIN_CREDENTIALS.user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  private async regularUserLogin(credentials: LoginCredentials): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    if (user.isActive !== undefined && !user.isActive) {
      throw new Error("Account is deactivated. Please contact support.");
    }
    
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    
    const token = this.generateToken(user._id!, user.email, user.role);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async verifyToken(token: string): Promise<Omit<User, "password">> {
    try {
      const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
      
      if (decoded.userId === this.ADMIN_CREDENTIALS.user._id) {
        const { ...userWithoutPassword } = this.ADMIN_CREDENTIALS.user;
        return userWithoutPassword;
      }

      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.isActive !== undefined && !user.isActive) {
        throw new Error("Account is deactivated");
      }
      
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = {
      userId,
      email,
      role,
    };

    const secret = process.env['JWT_SECRET'] as string;
    const options: SignOptions = {
      expiresIn: 3600
    };
    return jwt.sign(payload, secret, options);
  }

  getAdminInfo() {
    return {
      email: this.ADMIN_CREDENTIALS.email,
      hasPassword: !!this.ADMIN_CREDENTIALS.password
    };
  }
}