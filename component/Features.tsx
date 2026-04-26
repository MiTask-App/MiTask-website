import Image from "next/image"

export default function FeatureSection() {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50/50">
      
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-slate-900">
          Fitur Unggulan Kami
        </h2>
      </div>

      {/* Kontainer diperkecil dari max-w-5xl ke max-w-4xl agar tidak terlalu lebar */}
      <div className="relative max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-white">
        
        {/* Navigasi Panah (Samping) */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform">
          <span className="text-2xl font-bold">‹</span>
        </button>

        <div className="relative flex flex-col md:flex-row items-center justify-between p-10 md:p-20 gap-12">
          
          {/* Sisi Gambar - Diberi skala agar proporsional */}
          <div className="w-full md:w-[45%] flex justify-center">
            <div className="relative">
              {/* Dekorasi Glow di belakang hp */}
              <div className="absolute inset-0 blur-3xl rounded-full"></div>
              <Image
                src="/fitur_2.svg" 
                alt="feature"
                width={300}
                height={500}
                className="relative z-10 h-auto w-[180px] md:w-[600px] drop-shadow-2xl transform md:-rotate-2"
              />
            </div>
          </div>

          {/* Sisi Teks - Diberi lebar maksimal agar rapi */}
          <div className="w-full md:w-[55%] text-center md:text-left">
            <h3 className="text-2xl md:text-4xl font-bold mb-6 text-slate-800 leading-tight">
              List Task by Deadline
            </h3>
            <p className="text-gray-500 text-base md:text-xl leading-relaxed opacity-90">
              Urutkan tugas berdasarkan deadline terdekat. 
              Tidak ada lagi tugas yang terlewat atau dikerjakan mendadak.
            </p>
          </div>

        </div>

        <button className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform">
          <span className="text-2xl font-bold">›</span>
        </button>
      </div>

      {/* Indikator Bawah */}
      <div className="flex justify-center mt-12 gap-3">
        <div className="w-10 h-2 bg-blue-500 rounded-full transition-all"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full transition-all"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full transition-all"></div>
      </div>

    </section>
  )
}