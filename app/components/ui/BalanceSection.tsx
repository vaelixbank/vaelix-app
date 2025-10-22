'use client';

import { useRouter } from 'next/navigation';
import { formatBalance } from '../../lib/utils';

interface BalanceSectionProps {
  totalBalance: number;
  showBalance: boolean;
  useApiData: boolean;
  apiError: string | null;
}

export function BalanceSection({ totalBalance, showBalance, useApiData, apiError }: BalanceSectionProps) {
  const router = useRouter();

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <p className="text-slate-400 text-sm">Personnel · EUR</p>
        <div className={`px-2 py-1 rounded-full text-xs ${
          useApiData ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
        }`}>
          {useApiData ? 'API' : 'Mock'}
        </div>
      </div>
      <div className="text-7xl font-bold text-white">
        {showBalance ? `${formatBalance(totalBalance)} €` : '••••••'}
      </div>
      <button
        onClick={() => router.push('/account')}
        className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        aria-label="Voir les comptes et portefeuilles"
      >
        Comptes et Portefeuilles
      </button>
      {apiError && useApiData && (
        <div className="mt-2 px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 text-sm">
          Erreur API: {apiError}
        </div>
      )}
    </div>
  );
}