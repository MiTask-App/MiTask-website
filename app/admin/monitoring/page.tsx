"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: string;
  created_at: string;
  banned: boolean;
  taskTotal?: number;
  taskToday?: number;
}

interface Task {
  id: string;
  user_id: string;
  created_at: string;
}

export default function MonitoringPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sendingWarning, setSendingWarning] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    const allTasks: Task[] = tasksJson.data || [];
    const today = new Date().toDateString();

    const usersWithStats = (usersJson.data || []).map(
      (user: User, index: number) => {
        const userTasks = allTasks.filter((t) => t.user_id === user.id);
        const todayTasks = userTasks.filter(
          (t) => new Date(t.created_at).toDateString() === today,
        );
        return {
          ...user,
          user_code: `USR-${String(index + 1).padStart(3, "0")}`,
          taskTotal: userTasks.length,
          taskToday: todayTasks.length,
        };
      },
    );

    setUsers(usersWithStats);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    setOpenMenu(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const json = await res.json();
    if (json.success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert("User berhasil dihapus!");
    } else {
      alert("Gagal menghapus user!");
    }
  };

  const handleToggleAccess = async (userId: string, isBanned: boolean) => {
    setOpenMenu(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/users/${userId}/toggle-access`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banned: isBanned }),
      },
    );
    const json = await res.json();
    if (json.success) {
      alert(json.message);
      await fetchData(token);
    } else {
      alert("Gagal mengubah akses user!");
    }
  };

  const handleSendWarning = async (userId: string, username: string) => {
    if (!confirm(`Kirim peringatan ke ${username}?`)) return;
    setOpenMenu(null);
    setSendingWarning(userId);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/users/${userId}/send-warning`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const json = await res.json();
    setSendingWarning(null);
    alert(json.success ? `✅ ${json.message}` : `❌ ${json.message}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Memuat data monitoring...</p>
        </div>
      </div>
    );

  return (
    <div
      className="admin-page min-h-screen flex"
      style={{ background: "#f3f4f6" }}
    >
      {/* ─── SIDEBAR ─── */}
      <aside
        className="border-r flex flex-col fixed h-full z-20"
        style={{ width: "220px", background: "white", borderColor: "#e5e7eb" }}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0"
              style={{ width: "36px", height: "36px" }}
            >
              <img src="/logo (2).svg" alt="MiTask Logo" className="w-full h-full object-contain" />
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
            <img src="/dashboard.svg" alt="Dashboard Icon" className="w-4 h-4" />
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
            <img src="/monitoring.svg" alt="Monitoring Icon" className="w-4 h-4" />
            Data Monitoring
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <img src="/logout.svg" alt="Logout Icon" className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main
        className="flex-1 flex flex-col min-h-screen"
        style={{
          marginLeft: "220px",
          minWidth: 0,
          overflowX: "auto",
          background: "#f3f4f6",
        }}
      >
        {/* Topbar — background sama dengan main agar menyatu */}
        <header
          className="px-6 py-3 flex items-center justify-between sticky top-0 z-10"
          style={{ background: "#f3f4f6" }}
        >
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className="text-sm font-medium"
              style={{ color: "#5A81FA" }}
            >
              Admin
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
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
              Data Monitoring
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage and monitor user activity across the system.
            </p>
          </div>

          {/* Table Card */}
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm"
            style={{ overflowX: "auto" }}
          >
            <div
              style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: "900px",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  {/* Header row dengan background abu-abu sangat tipis */}
                  <tr
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      background: "#eef2f7",
                    }}
                  >
                    <th
                      style={{
                        textAlign: "left",
                        padding: "13px 20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#4b5563",
                        whiteSpace: "nowrap",
                        width: "110px",
                        letterSpacing: "0",
                        textTransform: "none",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "13px 20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#4b5563",
                        whiteSpace: "nowrap",
                        width: "180px",
                        letterSpacing: "0",
                        textTransform: "none",
                      }}
                    >
                      Username
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "13px 20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#4b5563",
                        whiteSpace: "nowrap",
                        width: "220px",
                        letterSpacing: "0",
                        textTransform: "none",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "13px 20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#4b5563",
                        whiteSpace: "nowrap",
                        width: "120px",
                        letterSpacing: "0",
                        textTransform: "none",
                      }}
                    >
                      Total Task
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "13px 20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#4b5563",
                        whiteSpace: "nowrap",
                        width: "120px",
                        letterSpacing: "0",
                        textTransform: "none",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "13px 20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#4b5563",
                        whiteSpace: "nowrap",
                        width: "100px",
                        letterSpacing: "0",
                        textTransform: "none",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          color: "#9ca3af",
                          padding: "60px",
                          fontSize: "14px",
                        }}
                      >
                        Tidak ada user ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f9fafb")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        {/* ID */}
                        <td
                          style={{ padding: "14px 20px", whiteSpace: "nowrap" }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontFamily: "monospace",
                              color: "#9ca3af",
                            }}
                          >
                            USR-{String(index + 1).padStart(3, "0")}
                          </span>
                        </td>

                        {/* Username */}
                        <td
                          style={{
                            padding: "14px 20px",
                            whiteSpace: "nowrap",
                            maxWidth: "180px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              minWidth: 0,
                            }}
                          >
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.username}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
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
                                    fontSize: "12px",
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
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0,
                              }}
                              title={user.username || "No Username"}
                            >
                              {user.username || "No Username"}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td
                          style={{
                            padding: "14px 20px",
                            color: "#6b7280",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.email || "-"}
                        </td>

                        {/* Total Task */}
                        <td
                          style={{ padding: "14px 20px", whiteSpace: "nowrap" }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color:
                                (user.taskTotal ?? 0) >= 500
                                  ? "#f97316"
                                  : "#374151",
                            }}
                          >
                            {(user.taskTotal ?? 0).toLocaleString()}
                          </span>
                        </td>

                        {/* Status */}
                        <td
                          style={{ padding: "14px 20px", whiteSpace: "nowrap" }}
                        >
                          {user.banned ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "4px 12px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: 500,
                                background: "#f3f4f6",
                                color: "#6b7280",
                              }}
                            >
                              Inactive
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 12px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: 500,
                                background: "#f0fdf4",
                                color: "#16a34a",
                                border: "1px solid #bbf7d0",
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

                        {/* Actions */}
                        <td
                          style={{ padding: "14px 20px", whiteSpace: "nowrap" }}
                        >
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                            data-dropdown
                          >
                            <button
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === user.id ? null : user.id,
                                )
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: "#9ca3af",
                              }}
                              onMouseEnter={(e) => {
                                (
                                  e.currentTarget as HTMLButtonElement
                                ).style.background = "#f3f4f6";
                                (
                                  e.currentTarget as HTMLButtonElement
                                ).style.color = "#374151";
                              }}
                              onMouseLeave={(e) => {
                                (
                                  e.currentTarget as HTMLButtonElement
                                ).style.background = "transparent";
                                (
                                  e.currentTarget as HTMLButtonElement
                                ).style.color = "#9ca3af";
                              }}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </button>

                            {openMenu === user.id && (
                              <div
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "38px",
                                  background: "white",
                                  border: "1px solid #f3f4f6",
                                  borderRadius: "12px",
                                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                  zIndex: 50,
                                  width: "176px",
                                  overflow: "hidden",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    handleSendWarning(user.id, user.username)
                                  }
                                  disabled={sendingWarning === user.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    width: "100%",
                                    padding: "10px 16px",
                                    fontSize: "13px",
                                    color: "#d97706",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "#fffbeb")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                  </svg>
                                  {sendingWarning === user.id
                                    ? "Mengirim..."
                                    : "Send Alert"}
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleAccess(user.id, false)
                                  }
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    width: "100%",
                                    padding: "10px 16px",
                                    fontSize: "13px",
                                    color: "#ca8a04",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "#fefce8")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line
                                      x1="4.93"
                                      y1="4.93"
                                      x2="19.07"
                                      y2="19.07"
                                    />
                                  </svg>
                                  Deactivate User
                                </button>

                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    width: "100%",
                                    padding: "10px 16px",
                                    fontSize: "13px",
                                    color: "#ef4444",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "#fef2f2")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                  </svg>
                                  Delete
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleAccess(user.id, true)
                                  }
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    width: "100%",
                                    padding: "10px 16px",
                                    fontSize: "13px",
                                    color: "#16a34a",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "#f0fdf4")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                  </svg>
                                  Restore
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}