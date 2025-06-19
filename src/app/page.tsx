// src/app/page.tsx
'use client';

import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { AppwriteException } from 'appwrite';
import Link from 'next/link'; // Use Next.js Link for client-side navigation
import Image from 'next/image';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Use Appwrite's email/password session method to log the user in
      await account.createEmailPasswordSession(email, password);
      // On success, redirect to the dashboard
      window.location.href = '/app/dashboard'; // A full page reload is good after login
    } catch (e) {
      if (e instanceof AppwriteException) {
        // Provide a user-friendly error message
        setError(e.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {/* Logo and Header */}
        <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
    <Image
        src="/finova-logo.jpg" // The path to your logo in the public folder
        alt="Finova Logo"
        width={40} // Specify the desired width in pixels
        height={40} // Specify the desired height in pixels
        className="rounded-md" // Optional: if you want the image itself to have rounded corners
    />
    <span className="text-3xl font-bold text-[#0d2235]">Finova</span>
</div>
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-md text-green-600">Please enter your details</p>
        </div>

        {/* Sign In Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          {error && <p className="text-center text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</p>}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}