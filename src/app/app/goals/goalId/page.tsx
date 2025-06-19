// src/app/(app)/goals/[goalId]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { account, databases } from '@/lib/appwrite';
import { Models, Query, AppwriteException, Functions } from 'appwrite';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, Loader2, Target, History } from 'lucide-react';

// --- Types ---
type Goal = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl?: string;
  status: string;
} & Models.Document;

type GoalTransaction = {
  type: 'deposit' | 'withdrawal';
  amount: number;
} & Models.Document;

// --- IMPORTANT: REPLACE WITH YOUR IDs ---
const DATABASE_ID = '6850456e0011f5b0c35e';
const GOALS_COLLECTION_ID = '685321a00036e064d496';
const GOAL_TRANSACTIONS_COLLECTION_ID = '685322ab00151f63b95e';
const MANAGE_GOAL_FUNCTION_ID = '6853248c00301b4ab25d';

// --- Deposit Modal Component ---
const DepositModal = ({ goal, onClose, onTransactionSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = JSON.stringify({
      action: 'deposit',
      goalId: goal.$id,
      amount: Number(amount),
    });

    try {
      const functions = new Functions(account.client);
      await functions.createExecution(MANAGE_GOAL_FUNCTION_ID, payload, false);
      onTransactionSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof AppwriteException && err.response
        ? JSON.parse(err.response).message
        : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4">Deposit to "{goal.name}"</h2>
        <form onSubmit={handleDeposit} className="space-y-4">
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <div>
            <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-700">Amount (₦)</label>
            <input
              type="number" id="deposit-amount" value={amount} onChange={e => setAmount(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="e.g., 10000" required min="1"
            />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="w-full py-3 bg-gray-200 rounded-lg font-semibold">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-blue-300 flex justify-center items-center">
              {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Confirm Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function GoalDetailPage() {
  const params = useParams();
  const goalId = params.goalId as string;
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [transactions, setTransactions] = useState<GoalTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!goalId) return;
    setIsLoading(true);
    try {
      // Fetch goal details and transactions in parallel
      const [goalResponse, transactionsResponse] = await Promise.all([
        databases.getDocument<Goal>(DATABASE_ID, GOALS_COLLECTION_ID, goalId),
        databases.listDocuments<GoalTransaction>(DATABASE_ID, GOAL_TRANSACTIONS_COLLECTION_ID, [
          Query.equal('goalId', goalId),
          Query.orderDesc('$createdAt'),
          Query.limit(25)
        ])
      ]);
      setGoal(goalResponse);
      setTransactions(transactionsResponse.documents);
    } catch (e) {
      console.error("Failed to fetch goal details", e);
      setError("Could not load this goal. It might have been deleted or there was a network issue.");
    } finally {
      setIsLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Target className="h-12 w-12 animate-pulse text-blue-500" /></div>;
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>
        <Link href="/goals" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to all goals
        </Link>
      </div>
    );
  }

  if (!goal) return null;

  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-8">
      {isModalOpen && <DepositModal goal={goal} onClose={() => setIsModalOpen(false)} onTransactionSuccess={fetchData} />}
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/goals" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 truncate">{goal.name}</h1>
      </div>
      
      {/* Main Goal Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
        <img src={goal.imageUrl || `https://via.placeholder.com/800x400/E0E7FF/4F46E5?text=Goal`} alt={goal.name} className="w-full h-56 object-cover rounded-lg" />
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-bold text-gray-800">₦{goal.currentAmount.toLocaleString()}</span>
            <span className="text-lg font-medium text-gray-500">of ₦{goal.targetAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-4 rounded-full" style={{ width: `${progress > 100 ? 100 : progress}%` }}></div>
          </div>
          <p className="text-center mt-2 text-sm font-semibold">{progress.toFixed(1)}% Complete</p>
        </div>
        <div className="flex gap-4 pt-4 border-t">
          <button onClick={() => setIsModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700">
            <Plus /> Deposit
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300">
            <Minus /> Withdraw
          </button>
        </div>
      </div>
      
      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4"><History /> Transaction History</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.length > 0 ? (
            transactions.map(tx => (
              <div key={tx.$id} className="flex justify-between items-center p-3 rounded-md bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'deposit' ? <Plus size={16}/> : <Minus size={16}/>}
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{tx.type}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.$createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No transactions for this goal yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}