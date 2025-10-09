'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../../lib/store';

export default function Send() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const addTransaction = useStore((state) => state.addTransaction);

  const handleSend = () => {
    // Mock send
    const transaction = {
      id: Date.now().toString(),
      amount: -parseFloat(amount),
      description: `Sent to ${recipient}`,
      date: new Date().toISOString().split('T')[0],
    };
    addTransaction(transaction);
    alert(`Sent $${amount} to ${recipient}`);
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send Money
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="recipient" className="sr-only">
                Recipient
              </label>
              <input
                id="recipient"
                name="recipient"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Recipient email or phone"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="amount" className="sr-only">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Money
            </button>
          </div>

          <div className="text-center">
            <Link href="/dashboard" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}