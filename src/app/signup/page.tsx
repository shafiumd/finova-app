// src/app/signup/page.tsx
'use client';

import { useState } from 'react';
import { account, ID } from '@/lib/appwrite'; // Make sure to import ID from appwrite
import { AppwriteException } from 'appwrite';
import Link from 'next/link';

// This is the React Component that is the default export
export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Create the user account in Appwrite Auth
      await account.create(ID.unique(), email, password, name);

      // 2. Automatically log the user in after successful registration
      await account.createEmailPasswordSession(email, password);
      
      // 3. Redirect to the dashboard
      // Note: We won't create the bank account document here. 
      // That can be a task for the dashboard page on its first load if an account doesn't exist.
      window.location.href = '/app/dashboard';
    } catch (e) {
      if (e instanceof AppwriteException) {
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
            <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-[#0d2235] text-white font-bold text-xl rounded-md">F</div>
                <span className="text-3xl font-bold text-[#0d2235]">Finova</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-md text-green-600">Join Finova today</p>
        </div>

        {/* Sign Up Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          {error && <p className="text-center text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</p>}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
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
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        
        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}