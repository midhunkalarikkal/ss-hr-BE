import { Router } from "express";
import { upload } from "../../config/multerConfig";
import { authMiddleware } from "../middleware/authMiddleware";
import { testimonialController } from "../controllers/testimonialController";

const router = Router();

router.post("/", authMiddleware, upload.single("clientPhoto"), testimonialController.createTestimonial);
router.get("/", authMiddleware, testimonialController.getAllTestimonials);
router.get("/stats", authMiddleware, testimonialController.getTestimonialStats);
router.get("/:id", authMiddleware,  testimonialController.getTestimonialById);
router.patch("/:id", authMiddleware,upload.single("clientPhoto"), testimonialController.updateTestimonial);
router.delete("/:id", authMiddleware,  testimonialController.deleteTestimonial);

export default router;