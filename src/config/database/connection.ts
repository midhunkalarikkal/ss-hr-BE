import mongoose from "mongoose";
import { mongoConfig } from "../env";

export class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      const mongoUri = mongoConfig.mongoURL;

      if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
      }

      await mongoose.connect(mongoUri);
      console.log("✅ Database connected");

      mongoose.connection.on("error", (error) => {
        console.error("❌ Database connection error:", error);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("⚠️ Database disconnected");
      });
    } catch (error) {
      console.error("❌ Failed to connect to database:", error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
    console.log("🛑 Database connection closed");
  }
}

// Export a helper so you don’t have to call getInstance everywhere
export const connectDB = async () => {
  await DatabaseConnection.getInstance().connect();
};

export const disconnectDB = async () => {
  await DatabaseConnection.getInstance().disconnect();
};
