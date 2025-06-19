// src/app/(app)/goals/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { AppwriteException, Functions } from 'appwrite';
import { ArrowLeft, Loader2, Target } from 'lucide-react';

// --- IMPORTANT: REPLACE WITH YOUR FUNCTION ID ---
const MANAGE_GOAL_FUNCTION_ID = '6853248c00301b4ab25d'; // This is your backend function

export default function CreateGoalPage() {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // For simplicity, we'll use a URL input.
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || Number(targetAmount) <= 0) {
      setError("Please provide a valid name and target amount.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = JSON.stringify({
      action: 'create',
      name,
      targetAmount: Number(targetAmount),
      imageUrl,
    });

    try {
      const functions = new Functions(account.client);
      await functions.createExecution(MANAGE_GOAL_FUNCTION_ID, payload, false);
      
      // On success, navigate back to the goals dashboard
      router.push('/app/goals');

    } catch (e) {
      console.error("Failed to create goal", e);
      const errorMessage = e instanceof AppwriteException && e.response
        ? JSON.parse(e.response).message
        : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Create a New Goal</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <Target className="h-12 w-12 mx-auto text-blue-500" />
            <p className="mt-2 text-gray-600">What are you saving for?</p>
          </div>
          
          {error && <div className="p-3 text-center text-red-700 bg-red-100 rounded-lg">{error}</div>}

          <div>
            <label htmlFor="goal-name" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              id="goal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., New Laptop"
              required
            />
          </div>

          <div>
            <label htmlFor="target-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount (₦)
            </label>
            <input
              type="number"
              id="target-amount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 500000"
              required
              min="1"
            />
          </div>
          
          <div>
            <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.png"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
          >
            {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Create Goal'}
          </button>
        </form>
      </div>
    </div>
  );
}