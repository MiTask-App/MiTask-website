"use client";

import { useEffect, useState } from "react";
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/tasks`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const json = await res.json();

    const sorted = (json.data || []).sort((a: Task, b: Task) => {
      const scoreA = getCategory(a).score;
      const scoreB = getCategory(b).score;

      if (scoreA === scoreB) {
        // Jika score sama, urutkan deadline terdekat dulu
        const deadlineA = a.deadline
          ? new Date(a.deadline).getTime()
          : Infinity;
        const deadlineB = b.deadline
          ? new Date(b.deadline).getTime()
          : Infinity;
        return deadlineA - deadlineB;
      }

      return scoreA - scoreB;
    });

    setTasks(sorted);
    setLoading(false);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Task Saya</h1>
            <p className="text-gray-500 text-sm">{userName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>Belum ada task. Tambahkan dari aplikasi mobile!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => {
              const category = getCategory(task);
              const urgent = isUrgent(task.deadline);

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg shadow p-4 border-l-4 ${category.borderColor}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Badge kategori + flag warna */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-base ${category.flagColor}`}>
                          ⚑
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}
                        >
                          {category.label}
                        </span>
                        {urgent && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                            ⚠ Deadline dekat!
                          </span>
                        )}
                      </div>

                      {/* Judul */}
                      <h2
                        className={`font-semibold text-lg ${
                          task.is_done ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.title}
                      </h2>

                      {/* Deskripsi */}
                      {task.description && (
                        <p className="text-gray-500 text-sm mt-1">
                          {task.description}
                        </p>
                      )}

                      {/* Deadline */}
                      {task.deadline && (
                        <p
                          className={`text-xs mt-2 ${
                            urgent
                              ? "text-orange-500 font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          📅{" "}
                          {new Date(task.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>

                    {/* Status selesai/belum */}
                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                        task.is_done
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {task.is_done ? "Selesai ✓" : "Belum selesai"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
