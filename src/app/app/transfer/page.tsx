// src/app/(app)/transfer/page.tsx (Updated to use the combined backend function)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { account } from '@/lib/appwrite';
import { AppwriteException, Functions } from 'appwrite';
import { Send, UserCheck, Loader2 } from 'lucide-react';

// --- IMPORTANT: Use the new, combined function ID ---
const TRANSACTION_FUNCTION_ID = '6850884c000a9258bae0'; // Replace with your actual combined function ID

export default function TransferPage() {
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null);
  const [status, setStatus] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  // --- 1. VERIFICATION LOGIC ---
  const handleVerifyAccount = useCallback(async (accountToVerify: string) => {
    setIsVerifying(true);
    setStatus(null); // Clear previous status messages
    setVerifiedAccountName(null);

    const payload = JSON.stringify({
      action: 'verify', // Specify the action
      accountNumber: accountToVerify
    });

    try {
      const functions = new Functions(account.client);
      const result = await functions.createExecution(TRANSACTION_FUNCTION_ID, payload, false);
      const response = JSON.parse(result.response);

      if (response.success) {
        setVerifiedAccountName(response.accountName);
      } else {
        setStatus({ message: response.message, type: 'error' });
      }
    } catch (error) {
      const errorMessage = error instanceof AppwriteException && error.response ? 
        JSON.parse(error.response).message : 'Could not connect to verification service.';
      setStatus({ message: errorMessage, type: 'error' });
    } finally {
      setIsVerifying(false);
    }
  }, []);

  // Debounce effect to trigger verification automatically
  useEffect(() => {
    const handler = setTimeout(() => {
      if (receiverAccount.length === 10) {
        handleVerifyAccount(receiverAccount);
      } else {
        setVerifiedAccountName(null); // Clear verification if number is incomplete
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [receiverAccount, handleVerifyAccount]);

  // --- 2. TRANSFER LOGIC ---
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedAccountName || !amount || isSubmitting) {
      setStatus({ message: 'Please verify recipient and enter an amount.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: 'Processing transaction...', type: 'info' });

    const payload = JSON.stringify({
      action: 'transfer', // Specify the action
      receiverAccountNumber: receiverAccount,
      amount: Number(amount)
    });

    try {
      const functions = new Functions(account.client);
      const result = await functions.createExecution(TRANSACTION_FUNCTION_ID, payload, false);
      const response = JSON.parse(result.response);

      if (response.success) {
        setStatus({ message: response.message, type: 'success' });
        setReceiverAccount('');
        setAmount('');
        setVerifiedAccountName(null);
      } else {
        setStatus({ message: response.message, type: 'error' });
      }
    } catch (error) {
      const errorMessage = error instanceof AppwriteException && error.response ? 
        JSON.parse(error.response).message : 'An unexpected error occurred.';
      setStatus({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Send Money</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleTransfer} className="space-y-6">
          
          {/* Account Number Input */}
          <div>
            <label htmlFor="receiver" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient's 10-Digit Account Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="receiver"
                value={receiverAccount}
                onChange={(e) => setReceiverAccount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0123456789"
                required
                maxLength={10}
              />
              {isVerifying && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                </div>
              )}
            </div>
          </div>

          {/* Verified Account Name Display */}
          {verifiedAccountName && !isVerifying && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 text-green-800 rounded-lg animate-fade-in-up">
              <UserCheck className="h-5 w-5 text-green-600" />
              <p className="font-semibold">{verifiedAccountName}</p>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₦)
            </label>
            <div className="relative">
              <p className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₦</p>
              <input
                type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="10000" required min="1"
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!verifiedAccountName || isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
            {isSubmitting ? 'Sending...' : 'Confirm & Send'}
          </button>
        </form>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`p-4 rounded-lg text-center font-medium
          ${status.type === 'success' && 'bg-green-100 text-green-800'}
          ${status.type === 'error' && 'bg-red-100 text-red-800'}
          ${status.type === 'info' && 'bg-blue-100 text-blue-800'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}