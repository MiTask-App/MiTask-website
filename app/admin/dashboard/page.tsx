"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: string;
  created_at: string;
  banned: boolean;
}

interface Task {
  id: string;
  user_id: string;
  is_done: boolean;
  priority: string;
  created_at: string;
}

const MiTaskLogo = () => (
  <img 
    src="/logo (2).svg" 
    alt="MiTask Logo" 
    width="36" 
    height="36" 
    style={{ objectFit: 'contain' }}
  />
);

// Simple bar chart 
const BarChart = ({ data }: { data: number[] }) => {
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOW", "DEC",
  ];
  const maxVal = Math.max(...data, 1);
  const chartH = 120;
  const barW = 20;
  const gap = 18;
  const totalW = data.length * (barW + gap);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${totalW} ${chartH + 35}`} 
      preserveAspectRatio="xMidYMid meet"
      className="overflow-visible" 
    >
      {data.map((val, i) => {
        const barH = (val / maxVal) * chartH;
        const x = i * (barW + gap);
        const y = chartH - barH;
        
        return (
          <g key={i} className="group cursor-pointer">
            {/* BACKGROUND BAR */}
            <rect
              x={x}
              y={0}
              width={barW}
              height={chartH}
              fill="#e8eaff"
            />
            
            {/* VALUE BAR  */}
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill="#4F46E5"
              className="transition-all duration-300 group-hover:fill-indigo-500"
              
            />

            {/* STATISTIK  */}
            {val > 0 && (
              <text
                x={x + barW / 2}
                y={y - 6} 
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#4F46E5" 
              >
                {val}
              </text>
            )}

            {/* 4. LABEL BULAN (Sumbu X) */}
            <text
              x={x + barW / 2}
              y={chartH + 18}
              textAnchor="middle"
              fontSize="8"
              fill="#9ca3af"
              className="group-hover:fill-slate-700 font-medium"
            >
              {months[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Donut chart menggunakan SVG murni
const DonutChart = ({
  high,
  medium,
  low,
}: {
  high: number;
  medium: number;
  low: number;
}) => {
  const total = high + medium + low;
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;

  const highPct = total > 0 ? high / total : 0;
  const medPct = total > 0 ? medium / total : 0;
  const lowPct = total > 0 ? low / total : 0;

  const highDash = highPct * circumference;
  const medDash = medPct * circumference;
  const lowDash = lowPct * circumference;

  const highOffset = 0;
  const medOffset = -highDash;
  const lowOffset = -(highDash + medDash);

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* background circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth="16"
      />
      {/* high - red */}
      {highPct > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#ef4444"
          strokeWidth="16"
          strokeDasharray={`${highDash} ${circumference - highDash}`}
          strokeDashoffset={highOffset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}
      {/* medium - orange */}
      {medPct > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f97316"
          strokeWidth="16"
          strokeDasharray={`${medDash} ${circumference - medDash}`}
          strokeDashoffset={medOffset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}
      {/* low - green */}
      {lowPct > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth="16"
          strokeDasharray={`${lowDash} ${circumference - lowDash}`}
          strokeDashoffset={lowOffset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}
      {/* center text */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#1f2937"
      >
        {total > 0 ? "100%" : "0%"}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fontSize="9"
        fill="#9ca3af"
        letterSpacing="1"
      >
        TOTAL
      </text>
    </svg>
  );
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/user/role`,
        { headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      const json = await res.json();
      if (json.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setToken(session.access_token);
      await fetchData(session.access_token);
      setLoading(false);
    };
    init();
  }, []);

  const fetchData = async (tok: string) => {
    const [usersRes, tasksRes] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/users-with-email`,
        {
          headers: { Authorization: `Bearer ${tok}` },
        },
      ),
      fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/tasks`, {
        headers: { Authorization: `Bearer ${tok}` },
      }),
    ]);
    const usersJson = await usersRes.json();
    const tasksJson = await tasksRes.json();
    setUsers(usersJson.data || []);
    setTasks(tasksJson.data || []);
  };

  const hitungDataPerBulan = () => {
    const grafikBulanan = Array(12).fill(0);

    tasks.forEach((task) => {
      if (!task.created_at) return;

      const tanggal = new Date(task.created_at);
      const indeksBulan = tanggal.getMonth(); // 0=Jan, 1=Feb, 2=Mar, 3=Apr, dst.

      if (indeksBulan >= 0 && indeksBulan < 12) {
        grafikBulanan[indeksBulan]++; 
      }
    });

    return grafikBulanan;
  };

  // Eksekusi fungsinya agar menghasilkan array [0, 0, 0, 5, 10, 2, 0, ...]
  const dataUntukChart = hitungDataPerBulan();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // --- Derived stats ---
  const totalUsers = users.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.is_done).length;

  const highTasks = tasks.filter((t) => t.priority === "high").length;
  const mediumTasks = tasks.filter((t) => t.priority === "medium").length;
  const lowTasks = tasks.filter(
    (t) => t.priority !== "high" && t.priority !== "medium",
  ).length;

  const highPct =
    totalTasks > 0 ? ((highTasks / totalTasks) * 100).toFixed(1) : "0.0";
  const medPct =
    totalTasks > 0 ? ((mediumTasks / totalTasks) * 100).toFixed(1) : "0.0";
  const lowPct =
    totalTasks > 0 ? ((lowTasks / totalTasks) * 100).toFixed(1) : "0.0";

  // Tasks per bulan (12 bulan terakhir dari data tasks)
  const monthlyData = Array(12).fill(0);
  const now = new Date();
  tasks.forEach((t) => {
    const d = new Date(t.created_at);
    const monthDiff =
      (now.getFullYear() - d.getFullYear()) * 12 +
      (now.getMonth() - d.getMonth());
    if (monthDiff >= 0 && monthDiff < 12) {
      monthlyData[11 - monthDiff]++;
    }
  });

  // Active users (tidak banned), tampilkan max 3
  const activeUsers = users.filter((u) => !u.banned).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ─── SIDEBAR ─── */}
      <aside
        className="bg-white border-r border-gray-200 flex flex-col fixed h-full z-20"
        style={{ width: "220px" }}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src="/logo (2).svg"
                alt="MiTask Logo"
                width="36"
                height="36"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div style={{ lineHeight: "1.2" }}>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#5A81FA",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                MiTask
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Daily time management
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              pathname === "/admin/dashboard"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            }`}
          >
            <img src="/dashboard.svg" alt="Dashboard Icon" width="16" height="16" />
            Dashboard
          </Link>
          <Link
            href="/admin/monitoring"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              pathname === "/admin/monitoring"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            }`}
          >
            <img src="/monitoring.svg" alt="Monitoring Icon" width="16" height="16" />
            Data Monitoring
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <img src='/logout.svg' alt="Logout Icon" width="16" height="16" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main
        className="flex-1 flex flex-col min-h-screen"
        style={{ marginLeft: "220px" }}
      >
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-end sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-gray-500 font-medium">Admin</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="px-7 py-6 flex-1">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              MiTask Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Here is a summary of MiTask activity.
            </p>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Total Users */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "10px",
                }}
              >
                Total Users
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#1f2937",
                  lineHeight: 1,
                }}
              >
                {totalUsers.toLocaleString()}
              </p>
              <div
                style={{
                  marginTop: "12px",
                  height: "3px",
                  width: "32px",
                  background: "#4F46E5",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* Total Tasks */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "10px",
                }}
              >
                Total Tasks
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#1f2937",
                  lineHeight: 1,
                }}
              >
                {totalTasks.toLocaleString()}
              </p>
              <div
                style={{
                  marginTop: "12px",
                  height: "3px",
                  width: "32px",
                  background: "#22c55e",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "10px",
                }}
              >
                Completed Tasks
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#1f2937",
                  lineHeight: 1,
                }}
              >
                {completedTasks.toLocaleString()}
              </p>
              <div
                style={{
                  marginTop: "12px",
                  height: "3px",
                  width: "32px",
                  background: "#9ca3af",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>

          {/* ── CHARTS ROW ── */}
          <div
            className="grid gap-4 mb-6"
            style={{ gridTemplateColumns: "1fr 280px" }}
          >
            {/* Bar Chart - Task Activity */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    Task Activity
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginTop: "2px",
                    }}
                  >
                    Annual Performance Overview
                  </p>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    background: "#f9fafb",
                  }}
                >
                  Last 12 Months
                </div>
              </div>
              <div style={{ padding: "0 4px" }}>
                <BarChart data={dataUntukChart} />
              </div>
            </div>

            {/* Donut Chart - Tasks by Priority */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p
                style={{ fontSize: "15px", fontWeight: 600, color: "#1f2937" }}
              >
                Tasks by Priority
              </p>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "2px",
                  marginBottom: "16px",
                }}
              >
                Priority Weight Distribution
              </p>

              <div className="flex justify-center mb-4">
                <DonutChart
                  high={highTasks}
                  medium={mediumTasks}
                  low={lowTasks}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#ef4444",
                        display: "inline-block",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: "#374151" }}>
                      High
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {highPct}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#f97316",
                        display: "inline-block",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: "#374151" }}>
                      Medium
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {medPct}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#22c55e",
                        display: "inline-block",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: "#374151" }}>
                      Low
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {lowPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── ACTIVE USERS TABLE ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                >
                  Active Users
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: "2px",
                  }}
                >
                  Currently Engaged Users
                </p>
              </div>
              <Link
                href="/admin/monitoring"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#4F46E5",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                }}
              >
                VIEW ALL
              </Link>
            </div>

            {/* Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 24px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      width: "60px",
                    }}
                  >
                    No
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    User
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#9ca3af",
                        fontSize: "13px",
                      }}
                    >
                      Tidak ada user aktif
                    </td>
                  </tr>
                ) : (
                  activeUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: "1px solid #f9fafb" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      {/* No */}
                      <td style={{ padding: "14px 24px", color: "#6b7280" }}>
                        {index + 1}
                      </td>

                      {/* User */}
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.username}
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #60a5fa, #2563eb)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  color: "white",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                }}
                              >
                                {(user.username || "U")[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span
                            style={{
                              fontWeight: 500,
                              color: "#374151",
                              maxWidth: "140px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {user.username || "No Username"}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                        {user.email || "-"}
                      </td>

                      {/* Role */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: "#ede9fe",
                            color: "#6d28d9",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 16px" }}>
                        {user.banned ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "12px",
                              color: "#6b7280",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#9ca3af",
                                display: "inline-block",
                              }}
                            />
                            Inactive
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "12px",
                              color: "#16a34a",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#22c55e",
                                display: "inline-block",
                              }}
                            />
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
