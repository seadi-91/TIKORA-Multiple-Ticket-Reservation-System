"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackForwarder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      router.replace(`/login?token=${encodeURIComponent(token)}`);
    } else if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return null;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackForwarder />
    </Suspense>
  );
}
