"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all authentication info
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("shop_id");

    // Redirect to login page
    router.replace("/login"); // assuming your login page is at /login
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <p className="text-slate-700 text-lg">Logging out...</p>
    </div>
  );
}
