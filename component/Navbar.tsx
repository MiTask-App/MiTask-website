import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md rounded-full shadow-md border border-black fixed top-0 w-full z-50">
      <div className="max-w-6xl mx-auto grid grid-cols-2 items-center p-3 px-6">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MiTask Logo" width={40} height={40} className="h-7 w-auto" />
          <span className="font-bold text-auto">MiTask</span>
        </div>

        {/* MENU */}
        <div className="flex justify-end gap gap-4 md:gap-8 text-sm font-medium">
          <Link href="#about">Tentang</Link>
          <Link href="#features">Fitur</Link>
          <Link href="#testimoni">Ulasan</Link>
          <Image src="/icons/pajamas_hamburger.svg" alt="menu" width={20} height={20} />
        </div>

      </div>
    </nav>
  );
}