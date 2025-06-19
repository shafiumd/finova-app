// src/app/(app)/profile/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import SubPageHeader from '@/components/SubPageHeader';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { Loader2 } from 'lucide-react';
import Toast from '@/components/Toast'; // Import the new Toast component

export default function DetailsPage() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    account.get().then(currentUser => {
      setUser(currentUser);
      setName(currentUser.name);
    }).catch(err => {
      console.error("Failed to fetch user", err);
    });
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (user && name === user.name)) {
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      const updatedUser = await account.updateName(name);
      setUser(updatedUser);
      setToast({ message: 'Name updated successfully!', type: 'success' });
    } catch (error) {
      console.error("Failed to update name:", error);
      setToast({ message: 'Failed to update name. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div>
      <SubPageHeader title="Personal Information" />
      <div className="p-4">
        <form onSubmit={handleUpdateName} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || name === user.name}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}