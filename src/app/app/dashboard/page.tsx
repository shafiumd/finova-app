// src/app/(app)/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { account, databases, ID } from '@/lib/appwrite';
import { Models, Query, AppwriteException } from 'appwrite';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownLeft, Send, Smartphone, Landmark } from 'lucide-react'; // For quick actions

// --- Type Definitions ---
type User = Models.User<Models.Preferences>;
type Account = {
    userId: string;
    balance: number;
    accountNumber: string;
    currency: string;
} & Models.Document;
type Transaction = Models.Document & {
    amount: number;
    description: string;
    status: string;
};

// --- Appwrite Constants ---

const DATABASE_ID = '6850456e0011f5b0c35e';
const ACCOUNTS_COLLECTION_ID = '68504806000392997b02';
const TRANSACTIONS_COLLECTION_ID = '685049a100144de2f82b'; // <-- PASTE YOUR ID
//const TRANSFER_FUNCTION_ID = 'process-transfer';

// --- Quick Actions Component ---
const QuickAction = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
  <Link href={href} className="flex flex-col items-center space-y-2">
    <div className="bg-blue-100 p-4 rounded-full">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </Link>
);


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<Account | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  // Function to create a new bank account for a first-time user
  const createNewBankAccount = useCallback(async (loggedInUser: User): Promise<Account | null> => {
    try {
      const newAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10);
      const newAccount = await databases.createDocument<Account>(
        DATABASE_ID, ACCOUNTS_COLLECTION_ID, ID.unique(),
        { userId: loggedInUser.$id, accountNumber: newAccountNumber, balance: 0, currency: 'NGN' }
      );
      return newAccount;
    } catch (error) {
      console.error("Failed to create new bank account:", error);
      return null;
    }
  }, []);

  // Main data fetching logic for user and their account
  const fetchData = useCallback(async () => {
    try {
      const loggedInUser = await account.get();
      setUser(loggedInUser);

      const response = await databases.listDocuments<Account>(
        DATABASE_ID, ACCOUNTS_COLLECTION_ID,
        [Query.equal('userId', loggedInUser.$id), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        setUserAccount(response.documents[0]);
      } else {
        const newAccount = await createNewBankAccount(loggedInUser);
        if (newAccount) setUserAccount(newAccount);
        else throw new Error("Could not create a bank account for the user.");
      }
      setAuthStatus('authenticated');
    } catch (error) {
      console.error("Authentication check failed", error);
      setAuthStatus('unauthenticated');
    }
  }, [createNewBankAccount]);

  // Fetch recent transactions once the user account is loaded
  useEffect(() => {
    if (userAccount) {
      const fetchRecentTransactions = async () => {
        try {
          const response = await databases.listDocuments<Transaction>(
            DATABASE_ID, TRANSACTIONS_COLLECTION_ID,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(3)
                // Note: This query relies on document-level permissions to only show user's transactions
            ]
          );
          setRecentTransactions(response.documents);
        } catch (error) {
          console.error("Failed to fetch recent transactions:", error);
        }
      };
      fetchRecentTransactions();
    }
  }, [userAccount]);

  // Handle redirects based on auth status
  useEffect(() => {
    if (authStatus === 'unauthenticated') router.push('/');
  }, [authStatus, router]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);


  if (authStatus === 'loading') {
    return <div className="flex items-center justify-center h-full">Verifying session...</div>;
  }

  if (authStatus === 'authenticated' && user && userAccount) {
    return (
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Welcome back,</p>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}!</h1>
          </div>
          {/* Add a Bell icon for notifications later */}
        </div>

        {/* Account Balance Card */}
        <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg">
          <p className="text-sm opacity-90">Total Balance</p>
          <p className="text-4xl font-bold tracking-tight mt-1">₦{userAccount.balance.toLocaleString()}</p>
          <p className="mt-4 text-sm opacity-90 font-mono">Account Number: {userAccount.accountNumber}</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <QuickAction href="/app/transfer" icon={Send} label="Send" />
          <QuickAction href="#" icon={Smartphone} label="Pay Bills" />
          <QuickAction href="#" icon={Landmark} label="Airtime" />
          <QuickAction href="/app/transactions" icon={ArrowUpRight} label="More" />
        </div>

        {/* Recent Transactions Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <div className="mt-3 space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map(tx => (
                <div key={tx.$id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5 text-green-600" /> : <ArrowUpRight className="h-5 w-5 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">{tx.description}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.$createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : '-'}₦{Math.abs(tx.amount).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4 p-4 bg-white rounded-lg">No recent transactions.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null; // Render nothing while redirecting
}