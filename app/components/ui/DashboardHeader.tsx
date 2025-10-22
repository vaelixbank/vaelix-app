'use client';

import { useRouter } from 'next/navigation';
import { Search, BarChart3, CreditCard, RefreshCw } from 'lucide-react';
import { Icon } from '../../../lib/icon';

interface DashboardHeaderProps {
  useApiData: boolean;
  setUseApiData: (value: boolean) => void;
}

export function DashboardHeader({ useApiData, setUseApiData }: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between pt-2 pb-4">
      {/* Left: Avatar with notification */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center border border-slate-500">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">VB</span>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xs mx-4">
        <div className="relative">
          <Icon icon={Search} size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setUseApiData(!useApiData)}
          className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
            useApiData
              ? 'bg-green-600/50 hover:bg-green-700/50'
              : 'bg-slate-800/50 hover:bg-slate-700/50'
          }`}
          aria-label={useApiData ? 'Utilise l\'API - Cliquer pour données mockées' : 'Données mockées - Cliquer pour API'}
        >
          <Icon icon={RefreshCw} size={18} className={useApiData ? 'text-green-300' : 'text-slate-300'} />
        </button>
        <button
          onClick={() => router.push('/analytics')}
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          aria-label="Voir les analyses"
        >
          <Icon icon={BarChart3} size={18} className="text-slate-300" />
        </button>
        <button
          onClick={() => router.push('/cards')}
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          aria-label="Voir les cartes"
        >
          <Icon icon={CreditCard} size={18} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
}