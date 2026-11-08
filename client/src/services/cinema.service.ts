import { TicketItem } from "@/types/ticket.types";
import { SeatInfo } from "@/types/booking.types";
import { TicketService } from "./ticket.service";

export const CinemaService = {
  getAllMovies(): TicketItem[] {
    return TicketService.getTicketsByCategory("CINEMA");
  },

  getMovieById(id: string): TicketItem | undefined {
    const movie = TicketService.getTicketById(id);
    return movie?.category === "CINEMA" ? movie : undefined;
  },

  async fetchMovieById(id: string): Promise<TicketItem | undefined> {
    const movie = await TicketService.fetchTicketById(id);
    return movie?.category === "CINEMA" ? movie : movie;
  },

  // Generates cinema hall layout (Rows A to H, 12 seats per row)
  generateCinemaSeats(): SeatInfo[] {
    const seats: SeatInfo[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const occupiedSet = new Set(["C-5", "C-6", "D-7", "D-8", "F-5", "F-6", "F-7", "G-10"]);

    rows.forEach((rowLetter, index) => {
      const isVip = rowLetter === "F" || rowLetter === "G";
      const isCouple = rowLetter === "H";
      const seatCount = isCouple ? 6 : 12;

      for (let num = 1; num <= seatCount; num++) {
        const id = `${rowLetter}-${num}`;
        const isOccupied = occupiedSet.has(id);

        let type: SeatInfo["type"] = "STANDARD";
        let price = 280;

        if (isVip) {
          type = "VIP";
          price = 380;
        } else if (isCouple) {
          type = "COUPLE";
          price = 600; // price for 2
        }

        seats.push({
          id,
          row: rowLetter,
          number: num,
          label: id,
          type,
          price,
          isAvailable: !isOccupied,
        });
      }
    });

    return seats;
  },
};

