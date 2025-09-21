import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { paymentController } from "../controllers/paymentController";

const router = Router();

router.post("/", authMiddleware, paymentController.createPayment);
router.get("/", authMiddleware, paymentController.getAllPayments);
router.get("/stats", authMiddleware, paymentController.getPaymentStats);
router.get("/customer/:customerId", authMiddleware, paymentController.getPaymentsByCustomer);
router.get("/package/:packageId", authMiddleware, paymentController.getPaymentsByPackage);
router.get("/status/:status", authMiddleware, paymentController.getPaymentsByStatus);
router.get("/:id", authMiddleware, paymentController.getPaymentById);
router.put("/:id", authMiddleware, paymentController.updatePayment);
router.delete("/:id", authMiddleware, paymentController.deletePayment);

export default router;