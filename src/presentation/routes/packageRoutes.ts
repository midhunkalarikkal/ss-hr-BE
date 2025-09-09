import { Router } from "express";
import { packageController } from "../controllers/packageController";
import { authMiddleware } from "../middleware/authMiddleware";

const packageRoutes = Router();

packageRoutes.post("/", authMiddleware, packageController.createPackage);
packageRoutes.get("/", authMiddleware, packageController.getAllPackages);
packageRoutes.get("/stats", authMiddleware, packageController.getPackageStats);
packageRoutes.get("/type/:type", authMiddleware, packageController.getPackagesByType);
packageRoutes.get("/:id", authMiddleware, packageController.getPackageById);
packageRoutes.put("/:id", authMiddleware, packageController.updatePackage);
packageRoutes.delete("/:id", authMiddleware, packageController.deletePackage);

export { packageRoutes as adminPackageRoutes };