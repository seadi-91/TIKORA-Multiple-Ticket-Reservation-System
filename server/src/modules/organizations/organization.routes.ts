import { Router } from "express";
import { OrganizationController } from "./organization.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// Protect all organization endpoints with authentication
router.use(authenticate);

router.get("/profile", OrganizationController.getProfile);
router.put("/profile", OrganizationController.updateProfile);

router.get("/organization", OrganizationController.getProfile);
router.put("/organization", OrganizationController.updateProfile);

// Staff and Gate Inspectors Management
router.get("/staff", OrganizationController.getStaff);
router.post("/staff", OrganizationController.createStaff);
router.patch("/staff/:id/status", OrganizationController.toggleStaffStatus);
router.delete("/staff/:id", OrganizationController.deleteStaff);

// Notifications & Alerts
router.get("/notifications", OrganizationController.getNotifications);
router.patch("/notifications/:id/read", OrganizationController.markNotificationRead);
router.patch("/notifications/read-all", OrganizationController.markAllNotificationsRead);

// Payouts & Settlements
router.get("/payouts", OrganizationController.getPayouts);

export default router;

