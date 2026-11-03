import React from "react";
import { InspectorSidebar } from "@/components/navigation/inspector-sidebar";
import { InspectorHeader } from "@/components/navigation/inspector-header";

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <InspectorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <InspectorHeader />
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
