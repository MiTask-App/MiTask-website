// src/components/dashboard/CalendarView.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Task } from "@/app/dashboard/page";

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks = [] }: CalendarViewProps) {
  const today = new Date();

  // Ambil string YYYY-MM-DD lokal untuk hari ini
  const todayYear = today.getFullYear();
  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay = String(today.getDate()).padStart(2, '0');
  const todayString = `${todayYear}-${todayMonth}-${todayDay}`;
  
  // State kalender aktif
  const [currentDate, setCurrentDate] = useState(new Date(todayYear, today.getMonth(), 1));

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // --- LOGIKA GRID KALENDER ---
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonthCells = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthCells.push({
      dayNum: totalDaysInPrevMonth - i,
      isCurrentMonth: false,
      dateObj: new Date(currentYear, currentMonth - 1, totalDaysInPrevMonth - i)
    });
  }

  const currentMonthCells = [];
  for (let i = 1; i <= totalDaysInMonth; i++) {
    currentMonthCells.push({
      dayNum: i,
      isCurrentMonth: true,
      dateObj: new Date(currentYear, currentMonth, i)
    });
  }

  const allGridCells = [...prevMonthCells, ...currentMonthCells];

  // 1. FILTER UNTUK LIST BAWAH: COCOKKAN DENGAN HARI INI (REAL-TIME NYATA)
  const todayTasks = tasks.filter((task) => {
    if (!task.deadline) return false;
    try {
      // Parsing UTC aman lewat object Date asli JavaScript
      const taskDate = new Date(task.deadline);
      const year = taskDate.getFullYear();
      const month = String(taskDate.getMonth() + 1).padStart(2, '0');
      const day = String(taskDate.getDate()).padStart(2, '0');
      const taskDateString = `${year}-${month}-${day}`;

      return todayString === taskDateString;
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-xs">
        
        {/* Kalender Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base md:text-lg font-bold text-slate-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-1">
              <button 
                onClick={handlePrevMonth} 
                className="p-1 text-gray-500 hover:bg-white rounded-md transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth} 
                className="p-1 text-gray-500 hover:bg-white rounded-md transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <span className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
              {monthNames[currentMonth].substring(0, 3)}
            </span>
            <span className="text-xs font-bold bg-slate-50 border border-gray-100 px-3 py-1.5 rounded-lg text-slate-600">
              {currentYear}
            </span>
          </div>
        </div>

        {/* Nama Hari Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 pb-2 border-b border-gray-50">
          <div className="text-red-500">Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Tanggal Grid */}
        <div className="grid grid-cols-7 gap-2 mt-2 text-slate-700 font-semibold text-xs min-h-[260px]">
          {allGridCells.map((cell, idx) => {
            // Bangun YYYY-MM-DD dari kotak kalender yang sedang di-render
            const cellYear = cell.dateObj.getFullYear();
            const cellMonth = String(cell.dateObj.getMonth() + 1).padStart(2, '0');
            const cellDay = String(cell.dateObj.getDate()).padStart(2, '0');
            const cellDateString = `${cellYear}-${cellMonth}-${cellDay}`;

            // Efek Highlight warna biru pada tanggal hari ini berjalan
            const isToday = cell.isCurrentMonth && todayString === cellDateString;

            // 2. FILTER UNTUK KOTAK TANGGAL KALENDER
            const cellTasks = tasks.filter((t) => {
              if (!t.deadline) return false;
              try {
                // Konversi string DB UTC menjadi lokal waktu client
                const taskDate = new Date(t.deadline);
                const year = taskDate.getFullYear();
                const month = String(taskDate.getMonth() + 1).padStart(2, '0');
                const day = String(taskDate.getDate()).padStart(2, '0');
                const taskDateString = `${year}-${month}-${day}`;

                return cellDateString === taskDateString;
              } catch (e) {
                return false;
              }
            });

            const isSunday = cell.dateObj.getDay() === 0;

            return (
              <div 
                key={idx} 
                className={`p-1.5 md:p-2 rounded-xl flex flex-col justify-between border min-h-[60px] sm:min-h-[75px] transition-all ${
                  !cell.isCurrentMonth 
                    ? 'bg-gray-50/50 border-transparent text-gray-300' 
                    : isToday 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                <span className={isSunday && !isToday ? "text-red-500" : ""}>
                  {cell.dayNum}
                </span>

                {/* Render teks/badge tugas di dalam kotak tanggal */}
                <div className="space-y-0.5 mt-1 max-h-[40px] overflow-hidden hidden sm:block">
                  {cellTasks.slice(0, 2).map((task) => (
                    <div 
                      key={task.id} 
                      className={`text-[8px] px-1 py-0.5 rounded-xs truncate font-medium ${
                        isToday
                          ? 'bg-white/20 text-white'
                          : task.priority?.toLowerCase() === 'high'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {cellTasks.length > 2 && (
                    <div className={`text-[7px] text-center font-bold ${isToday ? 'text-blue-200' : 'text-gray-400'}`}>
                      +{cellTasks.length - 2} more
                    </div>
                  )}
                </div>

                {/* Bulatan penanda khusus di tampilan mobile kecil */}
                {cellTasks.length > 0 && (
                  <div className="block sm:hidden flex justify-center gap-0.5 mt-0.5">
                    <span className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-blue-500'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian Bawah: Today's Task Layout */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-sm md:text-base">Today&apos;s Tasks</h3>
        
        {todayTasks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-xs text-gray-400 font-medium">
            🎉 No tasks scheduled for today!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayTasks.map((task) => {
              const d = new Date(task.deadline);
              const hours = String(d.getHours()).padStart(2, '0');
              const minutes = String(d.getMinutes()).padStart(2, '0');
              
              return (
                <div 
                  key={task.id} 
                  className={`bg-white p-4 rounded-xl border border-gray-100 border-l-4 ${
                    task.priority?.toLowerCase() === 'high' ? 'border-l-red-500' : 'border-l-amber-500'
                  }`}
                >
                  <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                  <div className="flex gap-3 text-[10px] font-medium text-gray-400 mt-1">
                    <span className={task.priority?.toLowerCase() === 'high' ? 'text-red-500' : 'text-amber-500'}>
                      ⏰ Due {hours}:{minutes}
                    </span>
                    <span className={task.priority?.toLowerCase() === 'high' ? 'text-red-500' : 'text-amber-500'}>
                      ⚑ {task.priority || "Medium"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 truncate">{task.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}