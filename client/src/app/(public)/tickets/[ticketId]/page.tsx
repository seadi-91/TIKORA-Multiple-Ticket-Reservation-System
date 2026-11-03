import { redirect, notFound } from "next/navigation";
import { TicketService } from "@/services/ticket.service";

export default async function UniversalTicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ticket = TicketService.getTicketById(ticketId);

  if (!ticket) {
    redirect("/search");
  }

  // Redirect directly to the dedicated detail route for that ticket category
  switch (ticket.category) {
    case "SPORTS":
      redirect(`/sports/${ticket.id}`);
    case "BUS":
      redirect(`/bus/${ticket.id}`);
    case "CINEMA":
      redirect(`/cinema/${ticket.id}`);
    case "EVENT":
      redirect(`/events/${ticket.id}`);
    default:
      redirect(`/search?q=${encodeURIComponent(ticket.title)}`);
  }
}
