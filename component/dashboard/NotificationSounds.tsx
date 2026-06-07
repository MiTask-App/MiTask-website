// src/components/dashboard/NotificationSounds.tsx
"use client";

import { useState, useEffect } from "react";
import { Play, CheckCircle2, Music } from "lucide-react";

interface SoundItem {
  id: string;
  name: string;
}

export default function NotificationSounds() {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [activeSound, setActiveSound] = useState<string>("Mitask Alert");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNotificationSounds() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_URL?.replace(/\/+$/, "");
        const res = await fetch(`${baseUrl}/api/notification-sounds`);
        if (res.ok) {
          const json = await res.json();
          setSounds(json.data || json);
        } else {
          throw new Error();
        }
      } catch {
        // Fallback data statis sesuai gambar contoh jika backend offline
        setSounds([
          { id: "1", name: "Mitask Alert" },
          { id: "2", name: "Digital Pulse" },
          { id: "3", name: "Crystal Chime" },
          { id: "4", name: "Subtle Knock" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchNotificationSounds();
  }, []);

  if (loading) {
    return <div className="text-center text-xs text-gray-400 py-8 bg-white rounded-2xl border border-gray-100">Memuat berkas suara...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
      <h3 className="font-bold text-slate-800 text-sm md:text-base">Notification Sounds</h3>
      <p className="text-[10px] uppercase font-bold text-gray-400 mt-0.5 tracking-wider">Your Notification Sounds</p>

      <div className="mt-4 space-y-1.5">
        {sounds.map((sound) => {
          const isSelected = activeSound === sound.name;
          return (
            <div
              key={sound.id}
              onClick={() => setActiveSound(sound.name)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                isSelected 
                  ? "bg-blue-50/60 border-blue-100 text-blue-600" 
                  : "bg-white border-transparent text-slate-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Play size={13} className={isSelected ? "fill-blue-600 text-blue-600" : "text-gray-400"} />
                <span className="text-xs md:text-sm font-semibold">{sound.name}</span>
              </div>
              {isSelected && <CheckCircle2 size={16} className="text-blue-600 fill-blue-50" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}