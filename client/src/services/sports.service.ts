import { TicketItem } from "@/types/ticket.types";
import { TicketService } from "./ticket.service";

export const SportsService = {
  getAllMatches(): TicketItem[] {
    return TicketService.getTicketsByCategory("SPORTS");
  },

  getMatchById(id: string): TicketItem | undefined {
    const match = TicketService.getTicketById(id);
    return match?.category === "SPORTS" ? match : undefined;
  },

  async fetchMatchById(id: string): Promise<TicketItem | undefined> {
    const match = await TicketService.fetchTicketById(id);
    return match?.category === "SPORTS" ? match : match;
  },
};

