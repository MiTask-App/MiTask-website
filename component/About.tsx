import Image from "next/image"
import Link from "next/link"

export default function Productivity() {
  return (
    <section id="about" className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-20 ">

      {/* TEXT AREA */}
      <div className="space-y-4 pl pl-10 md:pl-30 pr pr-10 md:pr-5">

        <h2 className="text text-3xl md:text-5xl font-bold leading-snug">
          Kelola Waktu <br />
          Anda dengan <br />
          Lebih <span className="text-blue-500">Efektif</span>
        </h2>

        <p className="text-gray-500 text-sm max-w-md text-justify">
          Tingkatkan produktivitas hingga 3x lipat dengan MiTask,
          aplikasi time management yang membantu mengatur
          tugas dan capai target anda dengan mudah.
        </p>

        <Link href="https://play.google.com/store/apps/details?id=com.mitask.app" target="_blank">
        <button className="mt-4 flex items-center gap-2 bg-[#5A81FA] text-black px-4 py-2 rounded-lg shadow-md">
          <img src="/icons/playstore.svg" alt="playstore" /> 
          <span>Play Store</span>
        </button>
        </Link>
      </div>

      {/* IMAGE AREA */}
      <div className="flex justify-center grid grid-cols-1 md:grid-cols-1 pl-10">
        <img
          src="/about_v2.webp"
          alt="MiTask devices"
          className="w-full h-auto rounded-lg"
          width={450}
          height={350}
        />
      </div>

    </section>
  )
}