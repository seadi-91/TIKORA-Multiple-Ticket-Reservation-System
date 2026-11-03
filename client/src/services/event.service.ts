import { TicketItem } from "@/types/ticket.types";
import { TicketService } from "./ticket.service";

export const EventService = {
  getAllEvents(): TicketItem[] {
    return TicketService.getTicketsByCategory("EVENT");
  },

  getEventById(id: string): TicketItem | undefined {
    const event = TicketService.getTicketById(id);
    return event?.category === "EVENT" ? event : undefined;
  },
};

