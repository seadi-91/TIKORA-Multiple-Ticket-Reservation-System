import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";

const router = Router();

// Protect all admin endpoints with authentication & ADMIN role
router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/users", AdminController.getUsers);
router.post("/users", AdminController.createUser);
router.patch("/users/:id/status", AdminController.toggleUserStatus);
router.delete("/users/:id", AdminController.deleteUser);

router.get("/providers", AdminController.getProviders);
router.patch("/providers/:id/status", AdminController.updateProviderStatus);
router.delete("/providers/:id", AdminController.deleteProvider);

router.get("/inspectors", AdminController.getInspectors);

router.get("/overview", AdminController.getOverview);

router.get("/audit-logs", AdminController.getAuditLogs);
router.post("/audit-logs", AdminController.createAuditLog);

router.get("/categories", AdminController.getCategories);
router.post("/categories", AdminController.createCategory);
router.patch("/categories/:id", AdminController.updateCategory);
router.delete("/categories/:id", AdminController.deleteCategory);

router.get("/notifications", AdminController.getNotifications);

export default router;

