import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="bg-white rounded-full shadow-md  border-1 border-black relative w-full overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-2 items-center p-3 px-6">

        {/* LEFT - LOGO */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="MiTask Logo"
            width={40}
            height={40}
          />
          <span className="font-bold text-lg">MiTask</span>
        </div>

        {/* CENTER - MENU */}
        <div className="flex justify-end gap-8 text-sm font-medium">
          <a href="#">Tentang</a>
          <a href="#">Fitur</a>
          <a href="#">Ulasan</a>
          <a href="#"><img src="/icons/pajamas_hamburger.svg" alt="hamburger" width={20} height={20}/></a>
        </div>

      </div>
    </nav>
  )
}