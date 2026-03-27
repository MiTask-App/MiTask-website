
import Image from 'next/image';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  imageSrc: string;
}

export const TestimonialCard = ({ name, role, content, imageSrc }: TestimonialProps) => {
  return (
    <div id="testimoni" className="flex flex-col w-[350px] shrink-0">
      {/* Bubble Chat Area */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative mb-6 min-h-[180px] flex items-center justify-center text-center">
        <p className="text-gray-800 text text-sm md:text-lg font-medium leading-relaxed">
          "{content}"
        </p>
        {/* Pointer segitiga di bawah (optional, jika ingin persis gaya chat) */}
        <div className="absolute -bottom-2 left-10 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
      </div>

      {/* User Info Area */}
      <div className="flex items-center gap-4 px-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img 
            src={imageSrc} 
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-gray-900 text text-sm md:text-lg">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};