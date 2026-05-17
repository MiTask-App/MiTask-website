'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  avatar_url: string
  created_at: string
  role: string
}

interface Task {
  id: string
  title: string
  user_id: string
  is_done: boolean
  priority: string
  deadline: string
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'tasks'>('users')
  const [token, setToken] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Cek role — kalau bukan admin, tendang keluar
      const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/user/role`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const json = await res.json()

      if (json.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setToken(session.access_token)
      await fetchUsers(session.access_token)
      await fetchTasks(session.access_token)
      setLoading(false)
    }

    init()
  }, [])

  const fetchUsers = async (token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    setUsers(json.data || [])
  }

  const fetchTasks = async (token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    setTasks(json.data || [])
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    const json = await res.json()
    if (json.success) {
      setUsers(users.filter(u => u.id !== userId))
      alert('User berhasil dihapus!')
    } else {
      alert('Gagal menghapus user!')
    }
  }

  const handleToggleAccess = async (userId: string, isBanned: boolean) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/admin/users/${userId}/toggle-access`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ banned: isBanned }),
      }
    )

    const json = await res.json()
    if (json.success) {
      alert(json.message)
      await fetchUsers(token)
    } else {
      alert('Gagal mengubah akses user!')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Memuat dashboard admin...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-500 text-sm">MiTask Management</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          <p className="text-gray-500 text-sm mt-1">Total User</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{tasks.length}</p>
          <p className="text-gray-500 text-sm mt-1">Total Task</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Kelola User ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeTab === 'tasks'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Semua Task ({tasks.length})
          </button>
        </div>

        {/* Tab Users */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="text-center text-gray-400 py-10">Tidak ada user</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{user.username || 'No Username'}</p>
                      <p className="text-gray-400 text-xs mt-1">ID: {user.id}</p>
                      <p className="text-gray-400 text-xs">
                        Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 inline-block ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    {user.role !== 'admin' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleAccess(user.id, true)}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs hover:bg-green-200"
                        >
                          Pulihkan
                        </button>
                        <button
                          onClick={() => handleToggleAccess(user.id, false)}
                          className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs hover:bg-yellow-200"
                        >
                          Nonaktifkan
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs hover:bg-red-200"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-400 py-10">Tidak ada task</p>
            ) : (
              tasks.map((task, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        User ID: {task.user_id}
                      </p>
                      {task.deadline && (
                        <p className="text-gray-400 text-xs">
                          Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}
                        </p>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 inline-block ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'medium'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {task.priority || 'No Priority'}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.is_done
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {task.is_done ? 'Selesai ✓' : 'Belum selesai'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}