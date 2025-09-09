import { Router } from "express";
import { testimonialController } from "../controllers/testimonialController";
import { authMiddleware } from "../middleware/authMiddleware";

const testimonialRoutes = Router();


testimonialRoutes.post("/", authMiddleware, testimonialController.createTestimonial);
testimonialRoutes.get("/", authMiddleware, testimonialController.getAllTestimonials);
testimonialRoutes.get("/stats", authMiddleware, testimonialController.getTestimonialStats);
testimonialRoutes.get("/:id", authMiddleware,  testimonialController.getTestimonialById);
testimonialRoutes.put("/:id", authMiddleware,  testimonialController.updateTestimonial);
testimonialRoutes.delete("/:id", authMiddleware,  testimonialController.deleteTestimonial);

export { testimonialRoutes as adminTestimonialRoutes };