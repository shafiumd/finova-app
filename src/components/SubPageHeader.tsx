// src/components/SubPageHeader.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function SubPageHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center p-4">
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
    </div>
  );
}