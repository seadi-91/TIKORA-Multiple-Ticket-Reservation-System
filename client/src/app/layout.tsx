import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { GuestBottomNav } from "@/components/navigation/guest-bottom-nav";

export const metadata: Metadata = {
  title: "TIKORA - Multi-Ticket Reservation Platform",
  description: "Book tickets for Buses, Cinema, Live Events, and Sports seamlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased dark">
      <body className="min-h-full flex flex-col font-sans transition-colors duration-200">
        <ThemeProvider>
          {children}
          <GuestBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
