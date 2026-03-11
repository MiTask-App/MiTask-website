import {TestimonialCard}  from "@/component/TestimonialCard";

const data = [
  {
    name: "Hanabi",
    role: "Mahasiswa Teknik Informatika",
    content: "App nya bagus sekali, fiturnya sangat membantu hidup saya",
    image: "/testimoni.svg" 
  },
   {
    name: "Egy",
    role: "Mahasiswa Teknik Informatika",
    content: "App nya bagus sekali, fiturnya sangat membantu saya",
    image: "/about.svg" 
  },
];

export default function TestimonialSection() {
  return (
    <section className="relative py-20 bg-slate-50 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Apa kata mereka??
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Nggak perlu pusing lagi ngatur jadwal. Yuk, intip pengalaman seru para pengguna yang sudah membuktikan kemudahan MiTask.
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-8 overflow-x-auto pb-8 snap-x no-scrollbar  ">
          {[...data, ...data, ...data].map((item, index) => (
            <div key={index} className="snap-center">
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
    </section>
  );
}