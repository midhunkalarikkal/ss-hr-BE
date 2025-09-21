import { Router } from "express";
import { testimonialController } from "../controllers/testimonialController";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../../config/multerConfig";

const router = Router();

router.post("/", authMiddleware, upload.single("clientPhoto"), testimonialController.createTestimonial);
router.get("/", authMiddleware, testimonialController.getAllTestimonials);
router.get("/stats", authMiddleware, testimonialController.getTestimonialStats);
router.get("/:id", authMiddleware,  testimonialController.getTestimonialById);
router.patch("/:id", authMiddleware,upload.single("clientPhoto"), testimonialController.updateTestimonial);
router.delete("/:id", authMiddleware,  testimonialController.deleteTestimonial);

export default router;