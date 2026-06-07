// src/components/dashboard/DashboardView.tsx
"use client";

import { Task } from "@/app/dashboard/page";
import { TrendingUp, CheckCircle, AlertCircle, SlidersHorizontal } from "lucide-react";

interface DashboardViewProps {
  tasks: Task[];
}

export default function DashboardView({ tasks }: DashboardViewProps) {
  const recorded = tasks.length;
  const completed = tasks.filter(t => t.is_done).length;
  const overdue = tasks.filter(t => !t.is_done && t.deadline && new Date(t.deadline).getTime() < Date.now()).length;

  // Konfigurasi warna dipisahkan secara eksplisit agar Tailwind mendeteksi kelasnya dengan sempurna
  const statsCards = [
    { 
      label: "TASK RECORDED", 
      val: recorded, 
      borderColor: "border-l-blue-600", 
      iconColor: "text-blue-600", 
      iconBg: "bg-blue-50", 
      icon: TrendingUp 
    },
    { 
      label: "COMPLETED", 
      val: completed, 
      borderColor: "border-l-emerald-500", 
      iconColor: "text-emerald-500", 
      iconBg: "bg-emerald-50", 
      icon: CheckCircle 
    },
    { 
      label: "OVERDUE", 
      val: overdue, 
      borderColor: "border-l-red-500", 
      iconColor: "text-red-500", 
      iconBg: "bg-red-50", 
      icon: AlertCircle 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cards Statistik Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsCards.map((card, i) => (
          <div 
            key={i} 
            className={`bg-white border border-gray-100 border-l-[6px] ${card.borderColor} p-5 rounded-2xl flex justify-between items-center shadow-xs`}
          >
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{card.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">
                {String(card.val).padStart(2, '0')}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${card.iconBg} ${card.iconColor}`}>
              <card.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Priority Tasks List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-base md:text-lg">Priority Tasks</h2>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 font-medium hover:text-blue-600 transition-colors">
            <SlidersHorizontal size={13} /> Sort by Due Date
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-5 rounded-xl border border-gray-100 border-l-[5px] ${
                task.priority?.toLowerCase() === 'high' ? 'border-l-red-500' : 'border-l-amber-500'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">{task.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{task.description}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide ${
                  task.priority?.toLowerCase() === 'high' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                }`}>
                  {task.priority || "Medium"}
                </span>
              </div>
              <div className="text-[11px] text-gray-400 font-medium mt-3 flex items-center gap-1">
                ⏰ Today, {task.deadline ? new Date(task.deadline).toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit'}) : "17:00"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}