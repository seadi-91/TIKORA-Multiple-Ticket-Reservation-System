import { Request, Response } from "express";
import { TicketService } from "./ticket.service";

export class TicketController {
  /**
   * GET /api/tickets/categories
   * Return platform categories and their current isActive status
   */
  static async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await TicketService.getCategories();
      res.status(200).json({ success: true, categories });
    } catch (error: any) {
      console.error("TicketController.getCategories error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch categories." });
    }
  }

  /**
   * GET /api/tickets
   */
  static async getAllTickets(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const city = req.query.city as string | undefined;
      const status = req.query.status as string | undefined;
      const providerIdStr = req.query.providerId as string | undefined;
      const providerId = providerIdStr ? parseInt(providerIdStr, 10) : undefined;
      const user = (req as any).user;
      const includeInactive = req.query.includeInactive === "true" || user?.role === "ADMIN";

      const tickets = await TicketService.getAllTickets({
        category,
        city,
        providerId,
        status,
        includeInactiveCategories: includeInactive,
      });
      res.status(200).json({ success: true, tickets });
    } catch (error: any) {
      console.error("TicketController.getAllTickets error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch tickets." });
    }
  }

  /**
   * GET /api/tickets/:id
   */
  static async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const tickets = await TicketService.getAllTickets({ includeInactiveCategories: true });
      const ticket = tickets.find((t) => t.id === id);

      if (!ticket) {
        res.status(404).json({ success: false, message: "Ticket listing not found." });
        return;
      }

      // If category is deactivated and requester is not an admin or provider
      const user = (req as any).user;
      const isPrivileged = user && (user.role === "ADMIN" || user.role === "ORGANIZATION" || user.role === "OPERATOR");
      if (ticket.categoryIsActive === false && !isPrivileged) {
        res.status(403).json({
          success: false,
          message: "This ticket's category is currently deactivated by platform administrators.",
          categoryDeactivated: true,
          ticket: {
            ...ticket,
            categoryIsActive: false,
          },
        });
        return;
      }

      res.status(200).json({ success: true, ticket });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to fetch ticket." });
    }
  }

  /**
   * POST /api/tickets
   * Create new ticket listing and persist to PostgreSQL
   */
  static async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const { title, category, location, city, date, time, price, basePrice } = req.body;

      if (!title || !category) {
        res.status(400).json({ success: false, message: "Title and Category are required." });
        return;
      }

      const user = (req as any).user;
      const createdTicket = await TicketService.createTicket(
        {
          ...req.body,
          price: Number(price || basePrice || 300),
          time: time || "05:30 PM",
        },
        user
      );

      res.status(201).json({
        success: true,
        message: "Ticket created and saved to database successfully.",
        ticket: createdTicket,
      });
    } catch (error: any) {
      console.error("TicketController.createTicket error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to create ticket." });
    }
  }

  /**
   * PATCH /api/tickets/:id/status
   */
  static async updateTicketStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const user = (req as any).user;

      if (!status) {
        res.status(400).json({ success: false, message: "Status is required." });
        return;
      }

      const updated = await TicketService.updateTicketStatus(id, String(status), user);
      res.status(200).json({ success: true, message: "Ticket status updated.", ticket: updated });
    } catch (error: any) {
      console.error("TicketController.updateTicketStatus error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to update ticket status." });
    }
  }

  /**
   * DELETE /api/tickets/:id
   */
  static async deleteTicket(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const user = (req as any).user;

      await TicketService.deleteTicket(id, user);
      res.status(200).json({ success: true, message: "Ticket offering deleted permanently." });
    } catch (error: any) {
      console.error("TicketController.deleteTicket error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to delete ticket." });
    }
  }
}

