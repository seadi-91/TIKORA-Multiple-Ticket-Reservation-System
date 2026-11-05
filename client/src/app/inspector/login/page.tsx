"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InspectorLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
        <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <span>Redirecting to TIKORA Sign In...</span>
      </div>
    </div>
  );
}
