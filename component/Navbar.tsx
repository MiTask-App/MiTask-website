'use client'; 

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-full shadow-md border border-black-200">
        <div className="flex items-center justify-between p-3 px-6">
          
          {/* LOGO */}
          <div className="flex items-center gap-2 shrink-0">
            <Image src="/logo (2).svg" alt="MiTask Logo" width={32} height={32} />
            <span className="font-bold text-lg text-blue-600">MiTask</span>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-9 text-sm font-medium text-gray-700">
            <Link href="#about" className="hover:text-blue-600">Tentang</Link>
            <Link href="#features" className="hover:text-blue-600">Fitur</Link>
            <Link href="#testimoni" className="hover:text-blue-600">Ulasan</Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>

          {/* ICON HAMBURGER (On mobile) */}
          <button 
            className="md:hidden p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Image 
              src={isOpen ? "/icons/close.svg" : "/icons/pajamas_hamburger.svg"} 
              alt="menu" 
              width={24} 
              height={24} 
            />
          </button>
        </div>

        {/* MENU MOBILE (DROPDOWN) */}
        <div className={`
          md:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 transition-all duration-300
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}>
          <div className="flex flex-col gap-4 text-center">
            <Link href="#about" onClick={() => setIsOpen(false)} className="font-medium text-gray-600">Tentang</Link>
            <Link href="#features" onClick={() => setIsOpen(false)} className="font-medium text-gray-600">Fitur</Link>
            <Link href="#testimoni" onClick={() => setIsOpen(false)} className="font-medium text-gray-600 border-b pb-2">Ulasan</Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}