import { Types } from "mongoose";
import { IUser, UserModel } from "./userModel";
import { Role, User } from "../../../domain/entities/user";
import {ApiPaginationRequest,ApiResponse,FetchUsersForChatSideBar} from "../../dtos/common.dts";
import { AdminFetchAllUsers,CreateUserProps,IUserRepository} from "../../../domain/repositories/IUserRepository";

export class UserRepositoryImpl implements IUserRepository {
  private mapToEntity(user: IUser): User {
    return new User(
      user._id,
      user.serialNumber,
      user.fullName,
      user.email,
      user.password,
      user.role,
      user.phone,
      user.phoneTwo,
      user.profileImage,
      user.isBlocked,
      user.isVerified,
      user.verificationToken,
      user.googleId,
      user.createdAt,
      user.updatedAt
    );
  }

  async generateNextSerialNumber(): Promise<string> {
    try {
    const lastUser = await UserModel.findOne({}, { serialNumber: 1 })
      .sort({ serialNumber: -1 })
      .lean();

    if (!lastUser || !lastUser.serialNumber) {
      return "U001";
    }

    const lastNumber = parseInt(lastUser.serialNumber.substring(1), 10);
    const nextNumber = lastNumber + 1;

    const newSerialNumber = `U${nextNumber.toString().padStart(3, "0")}`;
    return newSerialNumber;
  } catch (error) {
    console.log("error : ", error);
    throw new Error("Failed to generate serial number");
  }
  }

  async createUser(user: CreateUserProps): Promise<User> {
    try {
      const createdUser = await UserModel.create({ ...user });

      return this.mapToEntity(createdUser);
    } catch (error) {
      console.error("Detailed createUser error:", error);
      throw new Error(
        "Unable to register, please try again after a few minutes."
      );
    }
  }

  async verifyUser(verificationToken: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ verificationToken });
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      throw new Error("Unable to retrieve verification data.");
    }
  }

  async updateUser(user: User): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, {
        new: true,
      });
      return updatedUser ? this.mapToEntity(updatedUser) : null;
    } catch (error) {
      throw new Error("Unable to update user.");
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email });
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      throw new Error("Unable to find user by email.");
    }
  }

  async findAllUsers({
    page,
    limit,
  }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllUsers>> {
    try {
      const skip = (page - 1) * limit;
      const [users, totalCount] = await Promise.all([
        UserModel.find(
          { role:  "user"},
          {
            _id: 1,
            serialNumber: 1,
            fullName: 1,
            email: 1,
            role: 1,
            isBlocked: 1,
            isVerified: 1,
            createdAt: 1,
          }
        )
          .skip(skip)
          .limit(limit)
          .lean(),
        UserModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: users.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch users from database.");
    }
  }

  async findUserById(userId: Types.ObjectId): Promise<User | null> {
    try {
      const user = await UserModel.findById(userId);
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      throw new Error("User not found.");
    }
  }

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ googleId });
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      console.log("findUserByGoogleId error : ", error);
      throw new Error("User finding using googleId failed");
    }
  }

  async findAllUsersForChatSidebar(
    isAdmin: boolean
  ): Promise<FetchUsersForChatSideBar | null> {
    try {
      const filter = isAdmin
        ? { role: "user" }
        : { role: { $in: ["admin", "superAdmin"] } };

      const users = await UserModel.find(filter, {
        _id: 1,
        fullName: 1,
        profileImage: 1,
      });

      return users.length > 0
        ? users.map((user) => this.mapToEntity(user))
        : null;
    } catch (error) {
      console.log("findAllUsersForChatSidebar error :", error);
      throw new Error(`${isAdmin ? "Users" : "Chat Support"} fetching failed`);
    }
  }

  async findUserByEmailWithRole(
    email: string,
    role: Role
  ): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email, role });
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      throw new Error("User not found.");
    }
  }

  async deleteUser(userId: Types.ObjectId): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(userId);
      return !!result;
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
  async getTotalCount(): Promise<number> {
    try {
      return await UserModel.countDocuments();
    } catch (error) {
      throw new Error("Failed to get total count");
    }
  }
}
