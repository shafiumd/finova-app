// src/components/Toast.tsx
'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  // Automatically close the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 rounded-lg shadow-2xl animate-fade-in-up
      ${isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
    >
      {isSuccess ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
      <p className="font-semibold">{message}</p>
    </div>
  );
}