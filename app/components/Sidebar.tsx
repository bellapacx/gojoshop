"use client";

import { useState } from "react";
import {
  Home,
  BarChart2,
  ChevronDown,
  ChevronRight,
  Gamepad,
  Gift,
  Percent,
  Lock,
  LogOut,
  Smartphone,
  List,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface MenuItem {
  name: string;
  link?: string;
  icon: React.ReactNode;
  children?: { name: string; link: string }[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: <Home />, link: "/" },

  {
    name: "Report",
    icon: <BarChart2 />,
    children: [
      { name: "Daily Report", link: "/report/daily" },
      { name: "Detailed Report", link: "/report/detailed" },
    ],
  },

  {
    name: "Manage Cartela",
    icon: <List />,
    children: [
      { name: "Register New Cartela", link: "/crtela/register" },
      { name: "Manage Cartela", link: "/crtela/manage" },
    ],
  },

  {
    name: "Manage Game",
    icon: <Gamepad />,
    children: [
      { name: "Select Cartela for Game", link: "/game/select" },
      { name: "Easter Cartela", link: "/game/easter" },
    ],
  },

  { name: "Special Prize", icon: <Gift />, link: "/prize" },
  { name: "Set Profit Margin", icon: <Percent />, link: "/profit" },
  { name: "Change Password", icon: <Lock />, link: "/password" },
  { name: "Mobile Game", icon: <Smartphone />, link: "/mobile" },
  { name: "Logout", icon: <LogOut />, link: "/logout" },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [active, setActive] = useState("Dashboard");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 top-0 left-0 h-full w-64 bg-slate-800 text-slate-100 flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 text-2xl font-bold font-serif">ShopManager</div>
        <nav className="flex-1">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.name}>
                {/* Parent item */}
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === item.name ? null : item.name)
                  }
                  className={`flex items-center justify-between w-full gap-3 px-4 py-3 hover:bg-slate-700 ${
                    active === item.name ? "bg-slate-700" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {openMenu === item.name ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Submenu */}
                {openMenu === item.name && (
                  <div className="ml-10 flex flex-col">
                    {item.children.map((sub) => (
                      <a
                        key={sub.name}
                        href={sub.link}
                        onClick={() => setActive(sub.name)} // <-- removed setIsOpen(false)
                        className={`px-4 py-2 text-sm rounded hover:bg-slate-700 ${
                          active === sub.name
                            ? "bg-slate-700 border-l-4 border-indigo-500"
                            : ""
                        }`}
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.name}
                href={item.link}
                onClick={() => setActive(item.name)} // <-- removed setIsOpen(false)
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-700 ${
                  active === item.name
                    ? "bg-slate-700 border-l-4 border-indigo-500"
                    : ""
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
