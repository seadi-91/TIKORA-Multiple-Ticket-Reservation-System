import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { PlatformSettingsProvider } from "@/providers/platform-settings-provider";
import { GuestBottomNav } from "@/components/navigation/guest-bottom-nav";

export const metadata: Metadata = {
  title: "TIKORA - Ethiopia's Unified Ticket & Transit Hub",
  description: "Book tickets for Buses, Cinema, Live Events, and Sports seamlessly across Ethiopia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1117" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased dark">
      <body className="min-h-full min-h-[100dvh] flex flex-col font-sans transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <PlatformSettingsProvider>
              {children}
              <GuestBottomNav />
            </PlatformSettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
