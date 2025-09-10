import { Router } from "express";
import { paymentController } from "../controllers/paymentController";
import { authMiddleware } from "../middleware/authMiddleware";

const paymentRoutes = Router();

paymentRoutes.post("/", authMiddleware, paymentController.createPayment);
paymentRoutes.get("/", authMiddleware, paymentController.getAllPayments);
paymentRoutes.get("/stats", authMiddleware, paymentController.getPaymentStats);
paymentRoutes.get("/customer/:customerId", authMiddleware, paymentController.getPaymentsByCustomer);
paymentRoutes.get("/package/:packageId", authMiddleware, paymentController.getPaymentsByPackage);
paymentRoutes.get("/status/:status", authMiddleware, paymentController.getPaymentsByStatus);
paymentRoutes.get("/:id", authMiddleware, paymentController.getPaymentById);
paymentRoutes.put("/:id", authMiddleware, paymentController.updatePayment);
paymentRoutes.delete("/:id", authMiddleware, paymentController.deletePayment);

export { paymentRoutes as adminPaymentRoutes };