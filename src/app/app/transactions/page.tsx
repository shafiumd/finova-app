// src/app/(app)/transactions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { databases, Query, account } from '@/lib/appwrite';
import { Models } from 'appwrite';

// Define a type for your transactions
type Transaction = Models.Document & {
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    // You might also have sender/receiver details
};

// --- IMPORTANT: REPLACE THESE PLACEHOLDERS ---
const DATABASE_ID = '6850456e0011f5b0c35e';
const TRANSACTIONS_COLLECTION_ID = '685049a100144de2f82b';


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { $id } = await account.get();
        // Assuming your transaction document has a 'userId' field for queries
        // or relies on document-level permissions.
        const response = await databases.listDocuments<Transaction>(
          DATABASE_ID,
          TRANSACTIONS_COLLECTION_ID,
          [
            Query.orderDesc('$createdAt'), // Show newest first
            // Query.equal('userId', $id) // Use if you have a userId attribute
          ]
        );
        setTransactions(response.documents);
      } catch (e) {
        setError('Failed to load transactions.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading history...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map(tx => (
            <div key={tx.$id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <div>
                <p className="font-semibold">{tx.description}</p>
                <p className="text-sm text-gray-500">{new Date(tx.$createdAt).toLocaleString()}</p>
              </div>
              <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}