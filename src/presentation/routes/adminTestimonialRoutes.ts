import { Router } from "express";
import { testimonialController } from "../controllers/testimonialController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, testimonialController.createTestimonial);
router.get("/", authMiddleware, testimonialController.getAllTestimonials);
router.get("/stats", authMiddleware, testimonialController.getTestimonialStats);
router.get("/:id", authMiddleware,  testimonialController.getTestimonialById);
router.put("/:id", authMiddleware,  testimonialController.updateTestimonial);
router.delete("/:id", authMiddleware,  testimonialController.deleteTestimonial);

export default router;