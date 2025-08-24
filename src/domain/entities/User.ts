import { Types } from "mongoose";

export type Role = 'user' | 'admin' | 'superAdmin'

export class User {
  constructor(
    public _id: Types.ObjectId,
    public fullName: string,
    public email: string,
    public password: string,
    public role: Role,
    public phone: string,
    public profileImage: string,
    public isActive: boolean,
    public isVerified: boolean,
    public verificationToken: string,
    public googleId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {

  }
}




