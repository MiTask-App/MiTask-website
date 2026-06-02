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
              <svg
                viewBox="0 0 374 216"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
              >
                <path
                  d="M234.73 59.6795C219.641 68.3916 199.188 72.1199 179.508 70.8642L152.626 86.3852C178.527 95.2181 212.448 93.2099 234.703 80.3608L276.506 56.225L258.609 45.892L234.73 59.6795Z"
                  fill="#5A81FA"
                />
                <path
                  d="M337.681 70.8795L330.223 66.5733L312.326 76.9064L318.309 80.3608C321.998 82.4909 325.171 84.8061 327.828 87.2546C333.302 82.2111 336.586 76.6019 337.681 70.8795Z"
                  fill="#5A81FA"
                />
                <path
                  d="M312.326 56.2402L294.403 45.892L276.506 56.225L294.429 66.5733L312.326 56.2402Z"
                  fill="#5A81FA"
                />
                <path
                  d="M276.506 35.559L258.609 45.892L276.506 56.225L294.403 45.892L276.506 35.559Z"
                  fill="#5A81FA"
                />
                <path
                  d="M240.685 35.5427L258.609 45.892L276.506 35.559L258.582 25.2093L240.685 35.5427Z"
                  fill="#5A81FA"
                />
                <path
                  d="M194.377 20.9164L221.257 5.39676C218.628 4.49997 215.915 3.71496 213.14 3.0417C210.072 2.29729 206.928 1.68932 203.736 1.21824C201.86 0.941243 199.967 0.711481 198.063 0.528944C196.361 0.365832 194.651 0.240437 192.936 0.152749C191.395 0.0739301 189.849 0.0257413 188.303 0.00786064C186.882 -0.00852696 185.46 0.000673575 184.039 0.0357917C182.759 0.0673904 181.48 0.12007 180.204 0.193498C179.071 0.258729 177.941 0.340285 176.814 0.438482C176.274 0.485479 175.735 0.536334 175.198 0.590889C174.67 0.64438 174.144 0.701506 173.618 0.762263C173.085 0.823874 172.553 0.889302 172.022 0.958385C171.529 1.02268 171.036 1.09013 170.544 1.16089C170.067 1.22952 169.592 1.30126 169.117 1.37597C168.683 1.44429 168.25 1.51508 167.818 1.58848C157.335 3.3696 147.453 6.64669 139.182 11.4218L97.4066 35.5437L115.33 45.892L139.21 32.1045C154.285 23.4004 174.714 19.6711 194.377 20.9164Z"
                  fill="#5A81FA"
                />
                <path
                  d="M330.223 66.5733L312.326 56.2402L294.429 66.5733L312.326 76.9064L330.223 66.5733Z"
                  fill="#5A81FA"
                />
                <path
                  d="M139.21 59.6795C150.498 66.1966 164.787 69.9249 179.508 70.8642L240.685 35.5427L234.73 32.1045C223.428 25.5794 209.118 21.85 194.377 20.9164L133.225 56.224L139.21 59.6795Z"
                  fill="#5A81FA"
                />
                <path
                  d="M139.183 80.3608C143.305 82.7409 147.828 84.749 152.626 86.3852L179.508 70.8642C164.787 69.9249 150.498 66.1966 139.21 59.6795L133.225 56.224L115.302 66.5724L139.183 80.3608Z"
                  fill="#5A81FA"
                />
                <path
                  d="M97.405 118.268L115.302 107.935L79.4817 87.2537L61.5851 97.5867L97.405 118.268Z"
                  fill="#5A81FA"
                />
                <path
                  d="M97.405 118.268L61.5851 97.5867L43.6627 107.935L79.4817 128.616L97.405 118.268Z"
                  fill="#5A81FA"
                />
                <path
                  d="M115.302 66.5724L133.225 56.224L115.33 45.892L97.4066 56.2404L115.302 66.5724Z"
                  fill="#5A81FA"
                />
                <path
                  d="M61.587 76.9214L79.4817 87.2537L97.405 76.9053L79.5099 66.5733L61.587 76.9214Z"
                  fill="#5A81FA"
                />
                <path
                  d="M55.6299 94.1484C51.9407 92.0183 48.7675 89.7031 46.1102 87.2546C40.6283 92.3059 37.3425 97.9247 36.2529 103.656L43.6627 107.935L61.5851 97.5867L55.6299 94.1484Z"
                  fill="#5A81FA"
                />
                <path
                  d="M152.626 86.3852C147.828 84.749 143.305 82.7409 139.183 80.3608L115.302 66.5724L97.405 76.9053L133.225 97.5866L152.626 86.3852Z"
                  fill="#5A81FA"
                />
                <path
                  d="M133.225 97.5866L97.405 76.9053L79.4817 87.2537L115.302 107.935L133.225 97.5866Z"
                  fill="#5A81FA"
                />
                <path
                  d="M115.302 66.5724L97.4066 56.2404L79.5099 66.5733L97.405 76.9053L115.302 66.5724Z"
                  fill="#5A81FA"
                />
                <path
                  d="M194.377 20.9164C174.714 19.6711 154.285 23.4004 139.21 32.1045L115.33 45.892L133.225 56.224L194.377 20.9164Z"
                  fill="#5A81FA"
                />
                <path
                  d="M79.4817 87.2537L61.587 76.9214L55.6299 80.3608C51.9407 82.4909 48.7675 84.8061 46.1102 87.2546C48.7675 89.7031 51.9407 92.0183 55.6299 94.1484L61.5851 97.5867L79.4817 87.2537Z"
                  fill="#5A81FA"
                />
                <path
                  d="M55.6299 135.511L61.5851 138.949L79.4817 128.616L43.6627 107.935L36.2529 103.656C34.0944 115.01 40.5534 126.806 55.6299 135.511Z"
                  fill="#5A81FA"
                />
                <path
                  d="M97.4066 56.2404L115.33 45.892L97.4066 35.5437L79.4817 45.8911L97.4066 56.2404Z"
                  fill="#5A81FA"
                />
                <path
                  d="M11.2833 88.1653C10.9355 87.8639 10.5956 87.5603 10.2638 87.2546C0.0618016 96.6553 -2.53425 108.021 2.47608 118.422C2.58272 118.644 2.6928 118.865 2.80633 119.085C2.96853 119.4 3.13776 119.714 3.31401 120.027C3.60076 120.536 3.90622 121.042 4.2302 121.546C4.84936 122.508 5.53649 123.458 6.29159 124.395C6.54497 124.709 6.806 125.022 7.07469 125.334C7.10139 125.364 7.12866 125.396 7.15551 125.427C7.43337 125.746 7.71933 126.064 8.01338 126.38C8.25179 126.637 8.49552 126.892 8.74457 127.146C11.6834 130.14 15.3622 132.957 19.7828 135.51L43.6627 149.297L61.5851 138.949L55.6299 135.511C40.5534 126.806 34.0944 115.01 36.2529 103.656L19.7828 94.147C17.1887 92.6492 14.8496 91.0601 12.7657 89.3974C12.2563 88.991 11.7622 88.5803 11.2833 88.1653Z"
                  fill="#5A81FA"
                />
                <path
                  d="M10.2638 87.2546C10.5956 87.5603 10.9355 87.8639 11.2833 88.1653C11.7622 88.5803 12.2563 88.991 12.7657 89.3974C14.8496 91.0601 17.1887 92.6492 19.7828 94.147L36.2529 103.656C37.3425 97.9247 40.6283 92.3059 46.1102 87.2546C40.628 82.203 37.3422 76.5839 36.2527 70.8521L19.7835 80.3608C16.0941 82.491 12.9212 84.806 10.2638 87.2546Z"
                  fill="#5A81FA"
                />
                <path
                  d="M55.6299 80.3608L61.587 76.9214L43.6641 66.5729L36.2527 70.8521C37.3422 76.5839 40.628 82.203 46.1102 87.2546C48.7675 84.8061 51.9407 82.4909 55.6299 80.3608Z"
                  fill="#5A81FA"
                />
                <path
                  d="M97.4066 56.2404L79.4817 45.8911L61.5866 56.225L79.5099 66.5733L97.4066 56.2404Z"
                  fill="#5A81FA"
                />
                <path
                  d="M234.73 32.1045L240.685 35.5427L258.582 25.2093L234.702 11.4218C233.436 10.6907 232.132 9.99511 230.794 9.33433C230.544 9.21096 230.293 9.08867 230.041 8.96773C229.812 8.85789 229.582 8.74896 229.351 8.64113C229.015 8.48452 228.678 8.3299 228.338 8.17754C228.023 8.0359 227.706 7.89597 227.387 7.75801C226.537 7.39008 225.675 7.03546 224.803 6.69372C223.639 6.23814 222.457 5.80582 221.257 5.39676L194.377 20.9164C209.118 21.85 223.428 25.5794 234.73 32.1045Z"
                  fill="#5A81FA"
                />
                <path
                  d="M61.5866 56.225L43.6641 66.5729L61.587 76.9214L79.5099 66.5733L61.5866 56.225Z"
                  fill="#5A81FA"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M133.225 97.5866L139.21 101.042C165.587 116.271 208.353 116.271 234.73 101.042L294.429 66.5733L312.326 76.9064L234.703 121.723C208.326 136.953 165.56 136.953 139.183 121.723L115.302 107.935L133.225 97.5866ZM43.6641 66.5729L61.5866 56.225L79.4817 45.8911L97.4066 35.5437L139.182 11.4218L139.2 11.4114C147.467 6.64184 157.343 3.36769 167.818 1.58848C157.335 3.3696 147.453 6.64669 139.182 11.4218L97.4066 35.5437L79.4817 45.8911L61.5866 56.225L43.6641 66.5729ZM19.7828 135.51L43.6627 149.297L61.5851 138.949L139.21 183.767C165.587 198.997 208.353 198.997 234.73 183.767L318.309 135.511C333.397 126.799 339.855 114.992 337.681 103.63C336.586 97.9074 333.302 92.2982 327.828 87.2546C333.302 82.2111 336.586 76.6019 337.681 70.8795L354.102 80.3608C357.792 82.4909 360.965 84.8061 363.622 87.2546C379.963 102.312 376.79 122.412 354.102 135.511L234.703 204.449C208.326 219.678 165.56 219.678 139.183 204.449L19.7828 135.51Z"
                  fill="#5A81FA"
                />
                <path
                  d="M139.183 163.086C165.56 178.315 208.326 178.315 234.703 163.086L337.681 103.63C336.586 97.9074 333.302 92.2982 327.828 87.2546C325.171 89.7031 321.998 92.0183 318.309 94.1484L234.73 142.405C208.353 157.634 165.587 157.634 139.21 142.405L97.405 118.268L79.4817 128.616L139.183 163.086Z"
                  fill="#5A81FA"
                />
              </svg>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Data Monitoring
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
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