"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register?type=customer");
  }, [router]);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-8 shadow-xl text-center space-y-2">
      <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mx-auto" />
      <p className="text-xs text-muted-foreground">Redirecting to customer registration...</p>
    </div>
  );
}
