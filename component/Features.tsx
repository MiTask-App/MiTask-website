"use client"; // Pastikan ada ini karena kita menggunakan State
import { useState } from "react";
import Image from "next/image";

const featureData = [
  {
    id: 1,
    title: "Prioritaskan Tugas yang Paling Mendesak",
    desc: "MiTask secara cerdas mengatur jadwalmu, menempatkan deadline paling mendesak diurutan teratas.",
    image: "/fitur_v1.svg",
  },
  {
    id: 2,
    title: "Atur Notifikasi Sesuai Kebutuhanmu",
    desc: "Atur notifikasi sesuai preferensimu, pilih pengingat yang kamu butuhkan dan aktifkan atau nonaktikfkan kapan saja tanpa gangguan.",
    image: "/fitur_v2.svg", 
  },
  {
    id: 3,
    title: "Kalender Prioritasi Tugas",
    desc: "Lihat semua tugasmu dalam satu tampilan kalender yang intuitif, dengan penandaan warna untuk deadline yang mendekat.",
    image: "/fitur_v3.svg", 
  }
];

export default function FeatureSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === featureData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featureData.length - 1 : prev - 1));
  };

  return (
    <section id="features" className="py-20 px-6 bg-gray-50/50 overflow-hidden">
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-slate-900">
          Fitur Unggulan Kami
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Tombol Panah Kiri */}
        <button 
          onClick={prevSlide}
          className="absolute -left-6 md:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform"
        >
          <span className="text-2xl font-bold">‹</span>
        </button>

        {/* Container Utama Slider */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-white">
          <div 
            className="flex transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featureData.map((feature) => (
              <div key={feature.id} className="w-full flex-shrink-0">
                <div className="flex flex-col md:flex-row items-center justify-between p-10 md:p-20 gap-12">
                  {/* Sisi Gambar */}
                  <div className="w-full md:w-[45%] flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 blur-3xl rounded-full bg-blue-100 opacity-50"></div>
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={300}
                        height={500}
                        className="relative z-10 h-auto w-[180px] md:w-[600px] drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Sisi Teks */}
                  <div className="w-full md:w-[55%] text-center md:text-left">
                    <h3 className="text-2xl md:text-4xl font-bold mb-6 text-slate-800 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-base md:text-xl leading-relaxed opacity-90">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Panah Kanan */}
        <button 
          onClick={nextSlide}
          className="absolute -right-6 md:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform"
        >
          <span className="text-2xl font-bold">›</span>
        </button>
      </div>

      {/* Indikator Bawah (Auto Update) */}
      <div className="flex justify-center mt-12 gap-3">
        {featureData.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`cursor-pointer transition-all duration-300 ${
              currentIndex === index ? "w-10 h-2 bg-blue-500" : "w-2 h-2 bg-gray-300"
            } rounded-full`}
          />
        ))}
      </div>
    </section>
  );
}