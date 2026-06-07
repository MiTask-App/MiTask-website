// src/components/dashboard/Sidebar.tsx
"use client";

import Image from "next/image";
import { LogOut, LayoutDashboard, Calendar, User, Menu, X } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ currentTab, setCurrentTab, onLogout, isOpen, setIsOpen }: SidebarProps) {
  const menus = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white p-6 justify-between">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <Image src="/logo (2).svg" alt="MiTask Logo" width={32} height={32} priority className="w-8 h-auto" />
          <span className="text-xl font-bold text-blue-600 block leading-none">MiTask</span>
          <div>
            <span className="text-[9px] text-gray-400 font-medium">Daily time management</span>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="space-y-1.5">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = currentTab === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => {
                  setCurrentTab(menu.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 shadow-xs" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-slate-700"
                }`}
              >
                <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                {menu.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Button Logout di Bagian Bawah */}
      <button
        onClick={onLogout}
        className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all border-t border-gray-100 pt-4"
      >
        <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Top Navbar khusus untuk Mobile Screen */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo(2).svg" alt="MiTask" width={28} height={28} className="w-auto h-auto" />
          <span className="font-bold text-blue-600 text-lg">MiTask</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700 bg-gray-50 rounded-xl transition-colors active:bg-gray-100">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop overlay saat drawer mobile aktif */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar untuk Desktop Layout */}
      <aside className="hidden md:block w-64 border-r border-gray-100 sticky top-0 h-screen bg-white flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar Drawer Mode untuk Mobile Layout */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transform md:hidden transition-transform duration-300 ease-in-out border-r border-gray-100 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}