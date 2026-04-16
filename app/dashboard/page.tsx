'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Task {
  id: number
  title: string
  description: string
  deadline: string
  is_done: boolean
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      setUserName(session.user.email || '')
      await fetchTasks(session.access_token)

      // Setup real-time subscription ke perubahan di tabel tasks
      const channel = supabase
        .channel('tasks-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'tasks',
        }, () => {
          fetchTasks(session.access_token)
        })
        .subscribe()
        // Setup real-time subscription ke perubahan di tabel tasks

      return () => supabase.removeChannel(channel)
    }

    init()
  }, [])

  //meminta task ke laravel dengan token supabase sebagai otentikasi
  const fetchTasks = async (token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const json = await res.json()
    setTasks(json.data || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Memuat task...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
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
            {tasks.map((task, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{task.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                    {task.deadline && (
                      <p className="text-gray-400 text-xs mt-2">
                        Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.is_done
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.is_done ? 'Selesai' : 'Belum selesai'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}