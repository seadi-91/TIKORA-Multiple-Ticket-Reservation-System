import { TicketItem } from "@/types/ticket.types";
import { SeatInfo } from "@/types/booking.types";
import { TicketService } from "./ticket.service";

export const BusService = {
  getAllBuses(): TicketItem[] {
    return TicketService.getTicketsByCategory("BUS");
  },

  getBusById(id: string): TicketItem | undefined {
    const bus = TicketService.getTicketById(id);
    return bus?.category === "BUS" ? bus : undefined;
  },

  async fetchBusById(id: string): Promise<TicketItem | undefined> {
    const bus = await TicketService.fetchTicketById(id);
    return bus?.category === "BUS" ? bus : bus;
  },

  // Generates 48-seat layout (12 rows x 4 seats: A, B (Left window/aisle), C, D (Right aisle/window))
  generateBusSeats(occupiedCount = 18): SeatInfo[] {
    const seats: SeatInfo[] = [];
    const rows = 12;
    const cols = ["A", "B", "C", "D"];

    // Deterministic random occupied seats
    const occupiedSet = new Set(["1A", "1B", "3C", "4D", "6A", "7B", "8C", "9D", "10A", "11B"]);

    for (let r = 1; r <= rows; r++) {
      for (const col of cols) {
        const id = `${r}${col}`;
        const isWindow = col === "A" || col === "D";
        const isOccupied = occupiedSet.has(id);

        seats.push({
          id,
          row: r.toString(),
          number: parseInt(`${r}`),
          label: id,
          type: isWindow ? "WINDOW" : "AISLE",
          price: isWindow ? 680 : 650,
          isAvailable: !isOccupied,
        });
      }
    }

    return seats;
  },
};

