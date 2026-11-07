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

export default router;

