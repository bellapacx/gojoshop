"use client";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// List of public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      console.log(user)
      const isPublicRoute = publicRoutes.includes(pathname);
      
      // If no token and not on a public route, redirect to login
      if (!token && !isPublicRoute) {
        router.push("/login");
        return;
      }
      
      // If token exists and user is on login page, redirect to dashboard
      if (token && pathname === "/login") {
        router.push("/dashboard");
        return;
      }
      
      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, [router, pathname]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <html lang="en">
        <body className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </body>
      </html>
    );
  }

  // Don't show sidebar/navbar for public routes
  const isPublicRoute = publicRoutes.includes(pathname);
  
  if (isPublicRoute) {
    return (
      <html lang="en">
        <body className="bg-gray-50">
          <main>{children}</main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="flex h-screen bg-white">
        {/* Sidebar (hidden on mobile unless toggled) */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
          <main className="overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}