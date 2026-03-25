'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Update local query state if URL changes externally
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2 h-4 w-4 text-red-700" />
      <input
        type="text"
        placeholder="Search a blog..."
        value={query}
        onChange={handleSearch}
        className={`pl-9 pr-4 py-1.5 rounded-full bg-white border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 w-32 sm:w-48 transition-all ${isPending ? 'opacity-70' : ''}`}
      />
    </div>
  );
}
