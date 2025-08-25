import app from "./app";
import dotenv from "dotenv";
import { appConfig } from "./config/env";
import { connectDB, disconnectDB } from "./config/database/connection";

dotenv.config();

const port = parseInt(appConfig.port || "5000", 10);

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    const shutdown = async () => {
      console.log("\nShutting down server...");
      await disconnectDB();
      server.close(() => {
        console.log("🛑 Server stopped");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
