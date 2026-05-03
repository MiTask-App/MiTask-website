// component/TestimonialCard.tsx
import Image from "next/image";

export function TestimonialCard({ name, role, content, imageSrc }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      {/* Teks Testimoni */}
      <div className="mb-8">
        <p className="text-gray-700 text-center font-medium leading-relaxed">
          "{content}"
        </p>
      </div>

      {/* Profil Pengguna (Di dalam kartu) */}
      <div className="flex items-center gap-3 border-t border-gray-50 pt-6">
        <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-[#4F75FF]/10">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-left">
          <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}