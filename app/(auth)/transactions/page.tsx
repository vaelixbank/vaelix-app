'use client';

import Link from 'next/link';
import { useStore } from '../../../lib/store';

export default function Transactions() {
  const transactions = useStore((state) => state.transactions);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <li key={transaction.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {transaction.description.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : ''}${transaction.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500">
              Back to Dashboard
            </Link>
          </div>
      </div>
    </div>
  );
}