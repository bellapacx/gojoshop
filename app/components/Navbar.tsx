"use client";
import { Menu, User } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
      {/* Left side (Hamburger + Title) */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>

        
      </div>

      {/* Right side (User Profile) */}
      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-slate-600 font-medium">
          Admin
        </span>
        <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
          <User className="w-5 h-5 text-slate-700" />
        </button>
      </div>
    </header>
  );
}
