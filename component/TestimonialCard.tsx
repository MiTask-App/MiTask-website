import Image from 'next/image';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  imageSrc: string;
}

export const TestimonialCard = ({ name, role, content, imageSrc }: TestimonialProps) => {
  return (
    /* Gunakan padding (p-4) pada container luar agar shadow tidak terpotong */
    <div className="flex flex-col w-[320px] md:w-[400px] shrink-0 p-4"> 
      
      {/* Bubble Chat Area */}
      <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-lg border border-gray-50 relative mb-8 min-h-[200px] flex items-center justify-center text-center transition-transform hover:scale-[1.02] duration-300">
        <p className="text-gray-700 text-sm md:text-lg font-semibold leading-relaxed">
          "{content}"
        </p>
        
        {/* Pointer segitiga (Ekor Chat) */}
        <div className="absolute -bottom-3 left-12 w-6 h-6 bg-white border-b border-r border-gray-50 rotate-45"></div>
      </div>

      {/* User Info Area */}
      <div className="flex items-center gap-5 px-6">
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img 
            src={imageSrc} 
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-gray-900 text-base md:text-xl">{name}</h4>
          <p className="text-gray-500 text-xs md:text-sm font-medium">{role}</p>
        </div>
      </div>
    </div>
  );
};