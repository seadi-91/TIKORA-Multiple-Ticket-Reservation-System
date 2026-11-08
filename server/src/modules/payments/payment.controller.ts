import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  /**
   * POST /api/payments/chapa/initialize
   * Initiates payment with Chapa and returns hosted checkout link
   */
  static async initializeChapa(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const result = await PaymentService.initializeChapaTransaction(req.body, user);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("PaymentController.initializeChapa error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to initialize payment gateway.",
      });
    }
  }

  /**
   * GET /api/payments/chapa/verify/:txRef
   * Verifies payment status directly with Chapa gateway
   */
  static async verifyChapa(req: Request, res: Response): Promise<void> {
    try {
      const txRef = String(req.params.txRef);
      const result = await PaymentService.verifyChapaTransaction(txRef);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("PaymentController.verifyChapa error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to verify transaction.",
      });
    }
  }

  /**
   * POST /api/payments/webhook
   * Chapa webhook notification receiver
   */
  static async chapaWebhook(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      const txRef = payload?.tx_ref;
      if (txRef) {
        await PaymentService.verifyChapaTransaction(txRef);
      }
      res.status(200).json({ success: true, message: "Webhook processed" });
    } catch (error: any) {
      console.error("PaymentController.chapaWebhook error:", error);
      res.status(500).json({ success: false, message: "Webhook processing error" });
    }
  }
}
