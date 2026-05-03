"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  is_done: boolean;
  priority: string;
  created_at: string;
}

// Deadline dalam 1 hari ke depan atau sudah lewat = urgent
const isUrgent = (deadline: string): boolean => {
  if (!deadline) return false;
  const now = new Date();
  const due = new Date(deadline);
  const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 1;
};

type Category = {
  label: string;
  color: string;
  borderColor: string;
  flagColor: string;
  score: number;
};

// Logika kategori:
// high + urgent     = 🔴 High   (penting & deadline dekat)
// high + !urgent    = 🟡 Medium (penting tapi deadline jauh)
// medium + apapun   = 🟡 Medium
// low + urgent      = 🔵 Low    (tidak penting tapi deadline dekat)
// low + !urgent     = 🔵 Low
// kosong            = ⚪ No Priority
const getCategory = (task: Task): Category => {
  const priority = task.priority?.toLowerCase() ?? "";
  const urgent = isUrgent(task.deadline);

  if (priority === "high" && urgent) {
    return {
      label: "High",
      color: "bg-red-100 text-red-800",
      borderColor: "border-red-400",
      flagColor: "text-red-500",
      score: 1,
    };
  }

  if (priority === "high" && !urgent) {
    return {
      label: "High",
      color: "bg-red-100 text-red-800",
      borderColor: "border-red-400",
      flagColor: "text-red-500",
      score: 2,
    };
  }

  if (priority === "medium") {
    return {
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
      borderColor: "border-yellow-400",
      flagColor: "text-yellow-500",
      score: urgent ? 2 : 3,
    };
  }

  if (priority === "low") {
    return {
      label: "Low",
      color: "bg-blue-100 text-blue-800",
      borderColor: "border-blue-400",
      flagColor: "text-blue-500",
      score: urgent ? 4 : 5,
    };
  }

  return {
    label: "No Priority",
    color: "bg-gray-100 text-gray-500",
    borderColor: "border-gray-300",
    flagColor: "text-gray-400",
    score: 6,
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let channel: any;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUserName(session.user.email || "");
      await fetchTasks(session.access_token);

      await supabase.removeAllChannels();
      channel = supabase.channel("tasks-changes");

      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => fetchTasks(session.access_token),
      );

      channel.subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const fetchTasks = async (token: string) => {
    try {
      setError("");
      setLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_URL?.replace(/\/+$/, "");
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_LARAVEL_URL belum diset di .env.local");
      }

      const res = await fetch(`${baseUrl}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Fetch gagal ${res.status}: ${body}`);
      }

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : json;

      const sorted = (data || []).sort((a: Task, b: Task) => {
        const scoreA = getCategory(a).score;
        const scoreB = getCategory(b).score;

        if (scoreA === scoreB) {
          const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          return deadlineA - deadlineB;
        }

        return scoreA - scoreB;
      });

      setTasks(sorted);
    } catch (err: any) {
      console.error("Fetch task error:", err);
      setError(err.message || "Gagal mengambil task dari backend.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat task...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Hidden on mobile, visible on medium screens up */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 hidden md:block sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
            <Image
              src="/testimoni2.jpeg"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Hello, User</p>
            <p className="text-xs text-slate-500">
              {tasks.length} tasks planned
            </p>
          </div>
        </div>
        <nav>
          <div className="flex items-center gap-3 bg-blue-50 text-blue-600 p-3 rounded-xl font-medium">
            <Image
              src="/home_button_dashboard.svg"
              alt="Dashboard"
              width={20}
              height={20}
            />
            <span>Dashboard</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header - Mobile friendly padding/text size */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Task Saya
              </h1>
              <p className="text-gray-500 text-xs md:text-sm truncate max-w-[200px] md:max-w-none">
                {userName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-red-600 text-xs md:text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <strong>Error:</strong> {error}
              <p className="mt-2 text-xs text-red-600">
                Pastikan backend terdeploy, URL di .env.local benar tanpa slash di akhir, dan API menerima token auth.
              </p>
            </div>
          ) : null}

          {/* Statistik Card - Changed flex to grid for mobile responsiveness */}
          <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-sm p-6 md:p-8 grid grid-cols-3 gap-2 mb-8 border border-gray-50">
            <div className="text-center">
              <p className="text-xl md:text-4xl font-bold text-slate-800">
                {tasks.length}
              </p>
              <p className="text-blue-500 text-[10px] md:text-sm font-medium">
                Recorded
              </p>
            </div>
            <div className="border-x border-gray-100 text-center px-1">
              <p className="text-xl md:text-4xl font-bold text-slate-800">
                {tasks.filter((t) => t.is_done).length}
              </p>
              <p className="text-green-500 text-[10px] md:text-sm font-medium">
                Completed
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-4xl font-bold text-red-500">
                {
                  tasks.filter((t) => {
                    if (!t.deadline) return false;
                    return new Date(t.deadline).getTime() < Date.now();
                  }).length
                }
              </p>
              <p className="text-red-500 text-[10px] md:text-sm font-medium">
                Overdue
              </p>
            </div>
          </div>

          {/* Task List */}
          {tasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>Belum ada task. Tambahkan dari aplikasi mobile!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const category = getCategory(task);
                return (
                  <div
                    key={task.id}
                    className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm border-l-[8px] md:border-l-[10px] ${category.borderColor} flex flex-col gap-2 relative transition-all hover:shadow-md`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <h2
                        className={`text-lg md:text-xl font-bold text-slate-800 ${task.is_done ? "line-through text-slate-400" : ""}`}
                      >
                        {task.title}
                      </h2>

                      {/* Badges Container */}
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold whitespace-nowrap">
                          Due{" "}
                          {new Date(task.deadline).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="bg-gray-50 text-slate-600 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold flex items-center gap-1 border border-gray-100">
                          <span className={category.flagColor}>⚑</span>{" "}
                          {category.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-full md:max-w-[90%]">
                      {task.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
