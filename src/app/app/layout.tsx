// src/app/(app)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List,Target, Send, User } from 'lucide-react'; // npm install lucide-react

// --- You might want to move this to a dedicated components folder ---
const navItems = [
  { href: '/app/dashboard', label: 'Home', icon: Home },
  { href: '/app/transactions', label: 'History', icon: List },
  { href: '/app/transfer', label: 'Send', icon: Send },
  { href: '/app/goals', label: 'Goals', icon: Target },
  { href: '/app/profile', label: 'Profile', icon: User },
];

const NavLink = ({ href, label, icon: Icon }: typeof navItems[0]) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="flex flex-col items-center justify-center flex-1 space-y-1">
      <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
      <span className={`text-xs ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
        {label}
      </span>
    </Link>
  );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg">
        <nav className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </footer>
    </div>
  );
}