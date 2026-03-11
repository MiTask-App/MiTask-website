import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] text-center">

      {/* BACKGROUND BLOB */}
      <div className="absolute w-[450px] h-[450px] bg-blue-400 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative space-y-6 justify-center py-15">

        {/* RENCANAKAN */}
        <div className="flex items-center grid-cols-3 gap-3 justify-center">
          <Image
            src="/icons/rencana.svg"
            alt="plan"
            width={40}
            height={40}
          />
          <p className="text-2xl text-gray-600">Rencanakan</p>
        </div>

        {/* PRIORITASKAN */}
        <div className="flex items-center grid-cols-3  gap-3 justify-center">
          <Image
            src="/icons/prioritas.svg"
            alt="priority"
            width={40}
            height={40}
          />
          <p className="text-2xl text-gray-600">Prioritaskan</p>
        </div>

        {/* TUNTASKAN */}
        <div className="flex items-center grid-cols-5 gap-3 justify-center">
          <div className="pl-4">
            <Image
            src="/icons/tuntaskan.svg"
            alt="task"
            width={40}
            height={40}
          />
          </div>
          <h1 className="text-3xl font-bold">
            Tun<span className="text-blue-500">Task</span>an
          </h1>
        </div>

      </div>

    </section>
  )
}