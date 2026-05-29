import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen text-center px-4">
      
      {/* BACKGROUND BLOB KIRI */}
      <img
        src="/blob_kiri.webp"
        className="absolute bottom-0 left-0 w-[45%] max-w-[300px] pointer-events-none select-none z-10 mt-20"
      />

      {/* BACKGROUND BLOB KANAN */}
      <img
        src="/blob_kanan.webp"
        className="absolute top-0 right-0 w-[45%] max-w-[300px] pointer-events-none select-none z-10"
      />

      <div className="relative z-20 flex flex-col items-center max-w-7xl w-full">
        
        {/* Container text*/}
        <div className="flex flex-col items-center md:items-start space-y-6 md:space-y-8 relative">
          
          {/* Garis vertikal */}
          <div className="absolute left-[20px] top-4 bottom-4 w-[2px] bg-gray-200 -z-10"></div>

          {/* RENCANAKAN */}
          <div className="flex items-center gap-6 group mt-10">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Image src="/icons/rencana.svg" alt="plan" width={45} height={45} />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-gray-800">Rencanakan,</p>
          </div>

          {/* PRIORITASKAN */}
          <div className="flex items-center gap-6 md:translate-x-8">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Image src="/icons/prioritas.svg" alt="priority" width={45} height={45} />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-gray-800">Prioritaskan,</p>
          </div>

          {/* TUNTASKAN */}
          <div className="flex items-center gap-6 md:translate-x-16">
            <div className="bg-white p-2 rounded-lg shadow-sm border-2 border-blue-100">
               <Image src="/icons/tuntaskan.svg" alt="task" width={45} height={45} className="w-16 h-auto" />
            </div>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight">
              Tun<span className="text-blue-600">Task</span>an.
            </h1>
          </div>
        </div>

        {/* TOMBOL ACTION */}
        <div className="mt-16 flex flex-row gap-4 mb-20">
          <Link href="/login" target="_blank">
          <button className="bg-blue-500 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all">
            Masuk
          </button>
          </Link>
          <Link href="https://play.google.com/store/apps/details?id=com.mitask.app" target="_blank">
          <button className="bg-white border-2 border-gray-200 text-gray-700 px-10 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
            Dapatkan
          </button>
          </Link>
        </div>

      </div>
    </section>
  );
}