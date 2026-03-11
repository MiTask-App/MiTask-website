import Image from "next/image"

export default function Productivity() {
  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-20 ">

      {/* TEXT AREA */}
      <div className="space-y-4 pl-30">

        <h2 className="text-3xl font-bold leading-snug">
          Kelola Waktu <br />
          Anda dengan <br />
          Lebih <span className="text-blue-500">Efektif</span>
        </h2>

        <p className="text-gray-500 text-sm max-w-md">
          Tingkatkan produktivitas hingga 3x lipat dengan MiTask,
          aplikasi time management yang membantu mengatur
          tugas dan capai target anda dengan mudah.
        </p>


        <button className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
          <img src="/icons/playstore.svg" alt="playstore" /> Google Play
        </button>
      </div>

      {/* IMAGE AREA */}
      <div className="flex justify-center grid grid-cols-1 md:grid-cols-1 pl-10">
        <img
          src="/about.svg"
          alt="MiTask devices"
          className="w-full h-auto rounded-lg"
          width={450}
          height={350}
        />
      </div>

    </section>
  )
}