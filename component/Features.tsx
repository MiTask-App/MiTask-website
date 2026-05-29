"use client";
import { useState } from "react";
import Image from "next/image";

const featureData = [
  {
    id: 1,
    title: "Prioritaskan Tugas yang Paling Mendesak",
    desc: "MiTask secara cerdas mengatur jadwalmu, menempatkan deadline paling mendesak diurutan teratas.",
    image: "/FiturPriority.webp",
  },
  {
    id: 2,
    title: "Atur Notifikasi Sesuai Kebutuhanmu",
    desc: "Atur notifikasi sesuai preferensimu, pilih pengingat yang kamu butuhkan dan aktifkan atau nonaktikfkan kapan saja tanpa gangguan.",
    image: "/FiturNotif.webp", 
  },
  {
    id: 3,
    title: "Kalender Prioritasi Tugas",
    desc: "Lihat semua tugasmu dalam satu tampilan kalender yang intuitif, dengan penandaan warna untuk deadline yang mendekat.",
    image: "/FiturCalendar.webp", 
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
    <section id="features" className="py-20 px-4 md:px-6 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto mb-12 md:mb-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-slate-900">
          Fitur Unggulan Kami
        </h2>
      </div>

      {/* Main Slider Container */}
      <div className="relative max-w-4xl mx-auto">
        
        {/* Tombol Navigasi (Desktop & Mobile) */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-xl text-blue-600 hover:scale-110 active:scale-95 transition-all border border-gray-100"
          aria-label="Previous Slide"
        >
          <span className="text-xl md:text-2xl font-bold">‹</span>
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-xl text-blue-600 hover:scale-110 active:scale-95 transition-all border border-gray-100"
          aria-label="Next Slide"
        >
          <span className="text-xl md:text-2xl font-bold">›</span>
        </button>

        {/* Card Utama */}
        <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-white">
          <div 
            className="flex transition-transform duration-700 ease-in-out" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featureData.map((feature) => (
              <div key={feature.id} className="w-full flex-shrink-0">
                <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-20 gap-8 md:gap-12">
                  
                  {/* Sisi Gambar */}
                  <div className="w-full md:w-[45%] flex justify-center">
                    <div className="relative">
                      {/* Background Glow */}
                      <div className="absolute inset-0 blur-3xl rounded-full bg-blue-100 opacity-60"></div>
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={300}
                        height={500}
                        className="relative z-10 h-auto w-[160px] md:w-[280px] drop-shadow-2xl object-contain"
                      />
                    </div>
                  </div>

                  {/* Sisi Teks */}
                  <div className="w-full md:w-[55%] text-center md:text-left px-4 md:px-0">
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-slate-800 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm md:text-lg lg:text-xl leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-10 md:mt-12 gap-3">
        {featureData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 focus:outline-none ${
              currentIndex === index ? "w-10 h-2 bg-blue-500" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}