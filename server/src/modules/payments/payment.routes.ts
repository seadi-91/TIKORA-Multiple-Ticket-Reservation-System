import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { optionalAuthenticate } from "../../middleware/auth.middleware";

const router = Router();

// Chapa hosted checkout endpoints
router.post("/chapa/initialize", optionalAuthenticate, PaymentController.initializeChapa);
router.get("/chapa/verify/:txRef", PaymentController.verifyChapa);

// Webhook notification endpoint
router.post("/webhook", PaymentController.chapaWebhook);

export default router;

