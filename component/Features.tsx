import Image from "next/image"

export default function FeatureSection() {
  return (
    <section id="features" className="py-24 ">

      {/* TITLE */}
      <h2 className="text-center text-4xl font-bold mb-16">
        Fitur Unggulan Kami
      </h2>

      {/* CARD CONTAINER */}
      <div className="relative max-w-5xl mx-auto rounded-3xl p-25 shadow-lg bg-gradient-to-b from-[#B7D8EA] to-white">

        {/* ARROW LEFT */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl">
          ‹
        </button>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">

          {/* IMAGE */}
          <div className="flex justify-center">
            <Image
              src="fitur.svg"
              alt="feature"
              width={220}
              height={400}
              className="h-50 w-auto"
            />
          </div>

          {/* TEXT */}
          <div>
            <h3 className="text-2xl font-bold mb-3">
              List Task by Deadline
            </h3>

            <p className="text-gray-600">
              Urutkan tugas berdasarkan deadline terdekat.
              Tidak ada lagi tugas yang terlewat atau
              dikerjakan mendadak.
            </p>
          </div>

        </div>

        {/* ARROW RIGHT */}
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl">
          ›
        </button>

      </div>

      {/* INDICATOR */}
      <div className="flex justify-center mt-8 gap-3">
        <span className="w-8 h-3 bg-blue-500 rounded-full"></span>
        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
      </div>

    </section>
  )
}