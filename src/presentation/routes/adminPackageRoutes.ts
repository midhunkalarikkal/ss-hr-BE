import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { packageController } from "../controllers/packageController";

const router = Router();

router.post("/", authMiddleware, packageController.createPackage);
router.get("/", authMiddleware, packageController.getAllPackages);
router.get("/stats", authMiddleware, packageController.getPackageStats);
router.get("/type/:type", authMiddleware, packageController.getPackagesByType);
router.get("/:id", authMiddleware, packageController.getPackageById);
router.put("/:id", authMiddleware, packageController.updatePackage);
router.delete("/:id", authMiddleware, packageController.deletePackage);

export default router;