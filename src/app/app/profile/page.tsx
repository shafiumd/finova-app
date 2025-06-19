// src/app/(app)/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
// CORRECTED IMPORT LINE:
import { User, Shield, Bell, LogOut, ChevronRight, HelpCircle, Loader2 } from 'lucide-react';
import { Models } from 'appwrite';

const ProfileMenuItem = ({ icon: Icon, label, href }: { icon: React.ElementType, label: string, href: string }) => (
    <a href={href} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50">
        <div className="flex items-center space-x-4">
            <Icon className="h-6 w-6 text-gray-500" />
            <span className="font-semibold text-gray-800">{label}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
    </a>
);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push('/'); // Redirect if not logged in
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-2 pt-6">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
            {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Menu Section */}
      

<div className="space-y-3">
    <h2 className="text-sm font-semibold text-gray-500 px-2">ACCOUNT</h2>
    <ProfileMenuItem icon={User} label="Personal Information" href="/app/profile/details" />
    
    <h2 className="text-sm font-semibold text-gray-500 px-2 pt-4">SETTINGS</h2>
    {/* Corrected hrefs */}
    <ProfileMenuItem icon={Shield} label="Security" href="/app/profile/security" />
    <ProfileMenuItem icon={Bell} label="Notifications" href="/app/profile/notifications" />
    <ProfileMenuItem icon={HelpCircle} label="Help & Support" href="/app/profile/support" />
</div>
      

      {/* Logout Button */}
      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}