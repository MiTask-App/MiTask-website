import { TestimonialCard } from "@/component/TestimonialCard";

const data = [
  {
    name: "Anin",
    role: "Mahasiswa Teknik Informatika",
    content: "App nya bagus sekali, fiturnya sangat membantu hidup saya",
    image: "/anin.jpeg" 
  },
  {
    name: "Egy",
    role: "Mahasiswa Teknik Informatika",
    content: "App nya bagus sekali, fiturnya sangat membantu saya",
    image: "/egy.jpeg" 
  },
];

export default function TestimonialSection() {
  // Duplikasi data agar tidak ada celah kosong saat looping
  const duplicatedData = [...data, ...data, ...data, ...data];

  return (
    <section className="relative py-20 overflow-hidden bg-[#EBF5F7]">
      <div className="relative z-10 w-full px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Apa kata mereka??
          </h2>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Nggak perlu pusing lagi ngatur jadwal. Yuk, intip pengalaman seru para pengguna yang sudah membuktikan kemudahan MiTask.
          </p>
        </div>

        {/* Outer Container (The Window) */}
        <div className="flex overflow-hidden group">
          {/* Inner Moving Container */}
          <div className="animate-infinite-scroll flex gap-8">
            {duplicatedData.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[300px] md:w-[400px]">
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