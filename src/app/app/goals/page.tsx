// src/app/(app)/goals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { account, databases } from '@/lib/appwrite';
import { Models, Query } from 'appwrite';
import Link from 'next/link';
import { PlusCircle, PiggyBank, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Types ---
type Goal = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl?: string;
} & Models.Document;

// --- IMPORTANT: REPLACE WITH YOUR IDs ---
const DATABASE_ID = '6850456e0011f5b0c35e';
const GOALS_COLLECTION_ID = '685321a00036e064d496';

export default function GoalsDashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const user = await account.get();
        const response = await databases.listDocuments<Goal>(
          DATABASE_ID,
          GOALS_COLLECTION_ID,
          [Query.equal('userId', user.$id), Query.orderDesc('$createdAt')]
        );
        setGoals(response.documents);
      } catch (e) {
        console.error("Failed to fetch goals", e);
        setError("Could not load your savings goals. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PiggyBank className="h-12 w-12 animate-bounce text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Your Savings Goals</h1>
        <Link href="/app/goals/create" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <PlusCircle className="h-5 w-5" />
          New Goal
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-16 px-6 bg-gray-50 rounded-2xl border-2 border-dashed">
          <Target className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">No goals yet!</h2>
          <p className="mt-2 text-gray-500">Start saving for something amazing.</p>
          <Link href="/app/goals/create" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700">
            Create Your First Goal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <div 
              key={goal.$id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
              onClick={() => router.push(`/app/goals/${goal.$id}`)}
            >
              <img 
                src={goal.imageUrl || `https://via.placeholder.com/400x200/E0E7FF/4F46E5?text=${encodeURIComponent(goal.name)}`} 
                alt={goal.name} 
                className="w-full h-40 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 truncate">{goal.name}</h3>
                <div className="mt-4">
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                    <span>₦{goal.currentAmount.toLocaleString()}</span>
                    <span className="text-blue-600">₦{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}