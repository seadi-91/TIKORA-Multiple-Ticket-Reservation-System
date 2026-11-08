import { Router } from "express";
import { TicketController } from "./ticket.controller";
import { optionalAuthenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get("/categories", TicketController.getCategories);
router.get("/", optionalAuthenticate, TicketController.getAllTickets);
router.get("/:id", optionalAuthenticate, TicketController.getTicketById);
router.post("/", optionalAuthenticate, TicketController.createTicket);
router.patch("/:id/status", optionalAuthenticate, TicketController.updateTicketStatus);
router.delete("/:id", optionalAuthenticate, TicketController.deleteTicket);

export default router;

