"use client";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
