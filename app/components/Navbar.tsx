'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import SearchBar from './SearchBar';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const stickyClass = isAdminPage ? '' : 'sticky top-0 z-50';

  return (
    <nav className={`border-b border-zinc-200 bg-[#FDFBF7]/80 backdrop-blur-sm ${stickyClass}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        <div className="flex-1"></div>
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-bold text-3xl tracking-tight text-zinc-900"
        >
          Prof. <span className="text-red-700">B</span>log
        </Link>
        <div className="flex-1 flex justify-end">
          <Suspense fallback={<div className="w-32 sm:w-48 h-8 bg-zinc-300 rounded-full animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
