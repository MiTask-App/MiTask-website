import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="mt-5">
      <nav className="bg-white/80 backdrop-blur-md rounded-full shadow-md border border-black fixed top-0 w-full z-50 mt-2">
        <div className="max-w-6xl mx-auto grid grid-cols-2 items-center p-3 px-6">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MiTask Logo" width={40} height={40} />
            <span className="font-bold text-auto">MiTask</span>
          </div>

          {/* MENU */}
          <div className="flex justify-end gap gap-4 md:gap-9 text text-sm md:text-lg font-medium">
            <Link href="#about">Tentang</Link>
            <Link href="#features">Fitur</Link>
            <Link href="#testimoni">Ulasan</Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
            {/* <Image src="/icons/pajamas_hamburger.svg" alt="menu" width={20} height={20} /> */}
          </div>
        </div>
      </nav>
    </div>
  );
}
