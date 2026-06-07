"use client";

import Image from "next/image";
// Import Link dari next/link untuk navigasi halaman internal
import Link from "next/link";
import {
  ChevronRight,
  Info,
  ShieldCheck,
  FileText,
  Settings,
  BadgeAlert,
} from "lucide-react";
import { Task } from "@/app/dashboard/page";

interface ProfileViewProps {
  profile: { username: string; avatar_url: string };
  email: string;
  tasks: Task[];
}

export default function ProfileView({
  profile,
  email,
  tasks = [],
}: ProfileViewProps) {
  const completedTasksCount = tasks.filter(
    (task) => task.is_done === true,
  ).length;

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-xl font-bold text-slate-800">User Profile</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Your personal information and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Kotak Utama Profil Singkat */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-xs flex flex-col items-center justify-center min-h-[260px]">
          <div className="w-24 h-24 rounded-full relative overflow-hidden border-2 border-blue-500/20 p-1">
            <Image
              src={profile.avatar_url || "/default-avatar.png"}
              alt="Profile Picture"
              fill
              className="object-cover rounded-full"
            />
            <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-0.5 rounded-full border border-white">
              <ShieldCheck size={12} className="fill-blue-600" />
            </div>
          </div>
          <h2 className="text-base font-bold text-slate-800 mt-4">
            {profile.username}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{email}</p>

          <div className="mt-5 border-t border-gray-50 pt-4 w-full">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Tasks Done
            </p>
            <p className="text-xl font-black text-blue-600 mt-0.5">
              {String(completedTasksCount).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Menu Informasi Tambahan & Pengaturan Akun */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/50 border-b border-gray-50 text-[11px] font-bold text-gray-400 tracking-wider">
              SUPPORT & INFO
            </div>
            <div className="divide-y divide-gray-50">
              {/* TAMBAHKAN URL ROUTE DI PROPERTI href MASING-MASING MENU DI SINI */}
              {[
                { label: "About MiTask", icon: Info, href: "/" },
                {
                  label: "Privacy Policy",
                  icon: ShieldCheck,
                  href: "/Privacy",
                },
                { label: "Terms & Condition", icon: FileText, href: "/Term" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/60 transition-colors block"
                >
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <item.icon size={16} className="text-gray-400" />
                    {item.label}
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/50 border-b border-gray-50 text-[11px] font-bold text-gray-400 tracking-wider">
              ACCOUNT SETTINGS
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-slate-50/40 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Settings size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Secured by mobile authenticator
                  </p>
                </div>
              </div>
              <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white font-bold">
                ✓
              </div>
            </div>
            <div className="p-4 border-t border-gray-50 flex items-center justify-between text-red-500 font-semibold text-xs cursor-pointer hover:bg-red-50/40 transition-colors">
  <div className="flex items-center gap-3 w-full">
    <BadgeAlert size={16} className="text-red-400" />
    
    {/* Menggunakan tag <a> biasa agar browser langsung mengeksekusi aplikasi email */}
    <a 
      href={`mailto:mitaskpdbla1@gmail.com?subject=${encodeURIComponent(
        `Request Delete Account - ${profile.username}`
      )}&body=${encodeURIComponent(
        `Hello MiTask Team,\n\nI want to request deletion for my account.\n\nAccount Details:\n- Username: ${profile.username}\n- Email: ${email}\n\nThank you.`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-500 hover:text-red-600 font-semibold text-xs w-full block"
    >
      Request Delete Account
    </a>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
