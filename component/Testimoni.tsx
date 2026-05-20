import { TestimonialCard } from "@/component/TestimonialCard";

const data = [
  {
    name: "Anin",
    role: "Mahasiswa Teknik Informatika",
    content: "App nya bagus sekali, fiturnya sangat membantu hidup saya",
    image: "/Anin.svg" 
  },
  {
    name: "Egy",
    role: "Mahasiswa Teknik Informatika",
    content: "Keren banget, saya jadi lebih produktif dan nggak pernah lupa tugas lagi!",
    image: "/Egy.svg" 
  },
  {
    name: "Dewi",
    role: "Mahasiswa Teknik Informatika",
    content: "Saya sangat menikmati penggunaan MiTask. Membantu saya mengatur waktu dengan lebih baik.",
    image: "/Dewi.svg"
  },
  {
    name: "Akbar",
    role: "Mahasiswa Teknik Informatika",
    content: "Firtur custom notifikasi nya sangat membantu saya untuk tetap fokus pada tugas yang penting.",
    image: "/Akbar.svg"
  },
  {
    name: "Galih",
    role: "Mahasiswa Teknik Informatika",
    content: "Saya jadi lebih mudah mengatur jadwal dan prioritas tugas dengan MiTask.",
    image: "/Galih.svg"
  },
  {
    name: "Zulfi",
    role: "Mahasiswa Teknik Informatika",
    content: "Dengan MiTask, saya bisa mengatur jadwal dengan lebih efisien dan tidak pernah melewatkan deadline lagi.",
    image: "/Zulfi.svg"
  },
  {
    name: "Dira",
    role: "Mahasiswa Teknik Informatika",
    content: "MiTask sangat membantu saya dalam mengatur jadwal dan prioritas tugas.",
    image: "/Dira.svg"
  }
];

export default function TestimonialSection() {
  const duplicatedData = [...data, ...data, ...data, ...data, ...data];

  return (
    <section className="relative py-24 overflow-hidden bg-transparent">
      <div className="relative z-10 w-full">
        {/* Header Tetap Sama */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Apa kata Pengguna??
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nggak perlu pusing lagi ngatur jadwal. Yuk, intip pengalaman seru para pengguna yang sudah membuktikan kemudahan MiTask.
          </p>
        </div>

        {/* Carousel */}
        <div className="flex overflow-hidden relative">
          <div className="animate-infinite-scroll flex gap-8 py-4">
            {duplicatedData.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[320px] md:w-[420px]">
                <TestimonialCard 
                  name={item.name}
                  role={item.role}
                  content={item.content}
                  imageSrc={item.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}