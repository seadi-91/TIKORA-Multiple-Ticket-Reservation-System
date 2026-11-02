import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
