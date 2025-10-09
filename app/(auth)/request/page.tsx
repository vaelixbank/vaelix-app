'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Request() {
  const [amount, setAmount] = useState('');
  const [requester, setRequester] = useState('');

  const handleRequest = () => {
    // Mock request
    alert(`Requested $${amount} from ${requester}`);
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Request Money
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleRequest(); }}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="requester" className="sr-only">
                Requester
              </label>
              <input
                id="requester"
                name="requester"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Requester email or phone"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Request Money
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