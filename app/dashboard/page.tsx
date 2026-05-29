// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import Sidebar from "../../component/dashboard/Sidebar";
import DashboardView from "../../component/dashboard/DashboardView";
import CalendarView from "../../component/dashboard/CalendarView";
import ProfileView from "../../component/dashboard/ProfileView";
import ImageCarousel from "../../component/dashboard/ImageCarousel";
import NotificationSounds from "../../component/dashboard/NotificationSounds";

export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  is_done: boolean;
  priority: string;
}

export default function MainDashboard() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  
  // State profile disesuaikan agar menampung properti 'username' sesuai kebutuhan ProfileView
  const [profile, setProfile] = useState({ 
    username: "Loading...", 
    avatar_url: "/Egy.webp" 
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Inisialisasi Supabase Client
  const supabases = supabase;

  useEffect(() => {
    async function getDashboardData() {
      try {
        setLoading(true);

        // 1. Dapatkan data user yang sedang login dari Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          // Jika tidak ada user/sesi habis, tendang kembali ke halaman login
          router.push("/login");
          return;
        }

        // Set email dari auth
        setUserEmail(user.email || "");

        // 2. Query ke tabel 'profiles' berdasarkan ID user auth untuk mendapat username & avatar
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (!profileError && profileData) {
          setProfile({
            username: profileData.username || "User MiTask",
            avatar_url: profileData.avatar_url || "/testimoni2.jpeg",
          });
        } else {
          // Fallback jika data profiles belum dibuat/error, pakai email prefix sebagai username
          setProfile({
            username: user.email?.split("@")[0] || "User MiTask",
            avatar_url: "/testimoni2.jpeg",
          });
        }

        // 3. Query data Tasks milik user dari Supabase
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id); // Pastikan ada kolom relasi user_id di tabel tasks kamu

        if (!tasksError && tasksData) {
          setTasks(tasksData);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    getDashboardData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-[1300px] mx-auto w-full">
        {/* Top bar pencarian dan info user profil di bagian atas kanan */}
        <div className="hidden sm:flex justify-between items-center mb-8 gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks, keywords, or projects..." 
              className="w-full bg-slate-100/80 border border-transparent rounded-full pl-10 pr-4 py-2 text-xs font-medium focus:bg-white focus:border-gray-200 focus:outline-hidden transition-all text-slate-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">{profile.username}</p>
              <p className="text-[10px] text-gray-400 font-medium">User Mitask</p>
            </div>
            <div className="w-8 h-8 rounded-full relative overflow-hidden border border-gray-100 shadow-xs">
              <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Kondisi Render Sub View Tab Menu */}
        {currentTab === "calendar" && <CalendarView tasks={tasks} />}
        {currentTab === "profile" && <ProfileView profile={profile} email={userEmail} tasks={tasks} />}
        
        {currentTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="mb-2">
                <h1 className="text-xl md:text-2xl font-black text-slate-800">Hello, {profile.username}</h1>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  You have {tasks.filter(t => !t.is_done).length} tasks planned for today. Stay focused and productive.
                </p>
              </div>
              <DashboardView tasks={tasks} />
            </div>

            <div className="space-y-5 lg:sticky lg:top-6">
              <ImageCarousel />
              <NotificationSounds />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}