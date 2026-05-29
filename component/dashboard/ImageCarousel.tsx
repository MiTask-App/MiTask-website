// src/components/dashboard/ImageCarousel.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { id: 1, type: "custom_image", image: "/image1.webp" },
    { id: 2, type: "custom_image", image: "/image2.webp" },
    { id: 3, type: "custom_image", image: "/image3.webp" },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xs h-[160px] md:h-[180px]">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-full select-none">
            {slide.type === "template" ? (
              <div className="w-full h-full flex items-center justify-center p-6 text-center">
                <div className="max-w-xs md:max-w-md">
                  <p className="text-slate-700 font-medium text-base md:text-lg leading-relaxed">
                    &ldquo;<span className="font-semibold text-slate-900">Time</span> is your most valuable asset. <br />Use it <span className="font-bold text-blue-600">wisely</span>.&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              /* Di sini kita panggil komponen Image Next.js yang sebenarnya */
              <div className="w-full h-full relative">
                <Image
                  src={slide.image}
                  alt={`Slide Banner ${slide.id}`}
                  fill
                  priority={slide.id === 1}
                  className="object-cover rounded-2xl"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indikator Titik Slider (Pagination Dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? "w-5 bg-blue-600" : "w-1.5 bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}