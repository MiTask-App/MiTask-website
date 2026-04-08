import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full px-4 mb-4">
      <div className="bg-[#3b558d] text-white rounded-t-[40px] px-8 py-6 md:px-15 md:py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Bagian Kiri: Logo & Slogan */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {/* logo mitask */}
                 <img src="/footter.svg" alt="logo mitask" width={40} height={40} />
              <span className="text-2xl font-bold tracking-tight">MiTask</span>
            </div>

        
            <div className="hidden sm:block h-12 w-[1px] bg-white/30 mx-2"></div>
            
            <div className="hidden sm:block text-sm leading-tight text-white/90">
              <p>Rencanakan,</p>
              <p>Prioritaskan,</p>
              <p>TunTaskan.</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-white/80 font-light">
            © 2026 MiTask. All rights reserved.
          </div>

          {/* Links term & privacy */}
          <div className="flex items-center gap-8 text-sm font-medium">
            <p className="hover:text-gray-300 transition-colors">
              Term
            </p>
            <Link href="https://github.com/MiTask-App/MiTask-privacy-policy/blob/main/index.md" className="hover:text-gray-300 transition-colors">
              Privacy
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}