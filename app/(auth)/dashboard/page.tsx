'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { useApi } from '../../lib/useApi';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import { Icon } from '../../../lib/icon';
import { formatBalance } from '../../lib/utils';
import {
  Search,
  BarChart3,
  CreditCard,
  Plus,
  ArrowUpDown,
  Building2,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [useApiData, setUseApiData] = useState(false); // Toggle between mock and API data

  const {
    user,
    transactions,
    accounts,
    getTotalBalance,
    getMonthlyExpenses,
    setLoading,
    isAuthenticated
  } = useStore();

  const { loadDashboard, isLoading: apiLoading, error: apiError } = useApi();

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (useApiData) {
        // Load data from API
        await loadDashboard();
        setIsLoading(false);
      } else {
        // Simulate loading for mock data
        const timer = setTimeout(() => {
          setIsLoading(false);
          setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
      }
    };

    initializeDashboard();
  }, [isAuthenticated, router, setLoading, useApiData, loadDashboard]);

  // Memoized values for performance - moved before early returns
  const totalBalance = useMemo(() => getTotalBalance(), [getTotalBalance]);
  const recentTransactions = useMemo(() => transactions.slice(0, 3), [transactions]);
  const monthlyExpenses = useMemo(() => getMonthlyExpenses(), [getMonthlyExpenses]);
  const dayOfMonth = useMemo(() => new Date().getDate(), []);
  const lastDayOfMonth = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(), []);
  const monthProgressPercent = Math.min(100, Math.max(0, Math.round((dayOfMonth / lastDayOfMonth) * 100)));


  // Memoized handlers
  const handleToggleBalance = useCallback(() => {
    setShowBalance(!showBalance);
  }, [showBalance]);


  const handleTransactionClick = useCallback(() => {
    router.push('/transactions');
  }, [router]);

  if (isLoading || apiLoading) {
    return <DashboardSkeleton />;
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Pattern - Revolut style */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Futuristic cityscape effect */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-l from-teal-500/10 to-transparent rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto lg:max-w-4xl px-4 py-4 space-y-6">
        {/* Header - New design based on image */}
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
              className={`p-2 rounded-lg transition-colors ${
                useApiData
                  ? 'bg-green-600/50 hover:bg-green-700/50'
                  : 'bg-slate-800/50 hover:bg-slate-700/50'
              }`}
              title={useApiData ? 'Utilise l\'API - Cliquer pour données mockées' : 'Données mockées - Cliquer pour API'}
            >
              <Icon icon={RefreshCw} size={18} className={useApiData ? 'text-green-300' : 'text-slate-300'} />
            </button>
            <button
              onClick={() => router.push('/analytics')}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <Icon icon={BarChart3} size={18} className="text-slate-300" />
            </button>
            <button
              onClick={() => router.push('/cards')}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <Icon icon={CreditCard} size={18} className="text-slate-300" />
            </button>
          </div>
        </div>

        {/* Balance Section - Exact Revolut style */}
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
            onClick={handleToggleBalance}
            className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-white text-sm font-medium transition-colors"
          >
            Comptes et Portefeuilles
          </button>
          {apiError && useApiData && (
            <div className="mt-2 px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 text-sm">
              Erreur API: {apiError}
            </div>
          )}
        </div>
        
        {/* Carousel Indicators - 3 dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
        </div>

        {/* Quick Actions - 4 circular buttons */}
        <div className="flex justify-center space-x-8 py-4">
          <div className="flex flex-col items-center space-y-2">
            <button className="w-14 h-14 bg-slate-800/50 hover:bg-slate-700/50 rounded-full flex items-center justify-center transition-colors">
              <Icon icon={Plus} size={24} className="text-white" />
            </button>
            <span className="text-xs text-slate-400 text-center">Ajouter de l&apos;argent</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <button className="w-14 h-14 bg-slate-800/50 hover:bg-slate-700/50 rounded-full flex items-center justify-center transition-colors">
              <Icon icon={ArrowUpDown} size={24} className="text-white" />
            </button>
            <span className="text-xs text-slate-400 text-center">Transférer</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <button className="w-14 h-14 bg-slate-800/50 hover:bg-slate-700/50 rounded-full flex items-center justify-center transition-colors">
              <Icon icon={Building2} size={24} className="text-white" />
            </button>
            <span className="text-xs text-slate-400 text-center">Informations</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <button className="w-14 h-14 bg-slate-800/50 hover:bg-slate-700/50 rounded-full flex items-center justify-center transition-colors">
              <Icon icon={MoreHorizontal} size={24} className="text-white" />
            </button>
            <span className="text-xs text-slate-400 text-center">Plus</span>
          </div>
        </div>

        {/* Transactions List - Microsoft style */}
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-slate-800/50 rounded-2xl p-4 hover:bg-slate-700/50 transition-colors cursor-pointer"
              onClick={handleTransactionClick}
            >
              <div className="flex items-center space-x-4">
                {/* Microsoft Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MS</span>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-medium">{transaction.description}</h4>
                  <p className="text-slate-400 text-sm">
                    {new Date(transaction.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}, {new Date(transaction.date).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} · Vérification de la carte
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-bold">
                    {transaction.type === 'income' ? '+' : '-'}€{Math.abs(transaction.amount).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
          {/* Cartes */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Cartes</h2>
              <span className="text-slate-400 text-sm">›</span>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {accounts.slice(0, 3).map((account) => (
                <div key={account.id} className="min-w-[180px] h-28 rounded-xl p-4 bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-10 rounded bg-white/20" />
                    <div className="h-6 w-10 rounded bg-white/20" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs mb-1">{account.name}</p>
                    <p className="text-white font-semibold tracking-wider">•••• {account.iban ? account.iban.slice(-4) : '0000'}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="w-2 h-2 rounded-full bg-slate-500" />
            </div>
          </section>

          {/* Dépensés ce mois-ci */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-300 text-sm">Dépensés ce mois-ci</h2>
              <span className="text-slate-300 text-sm">0 €</span>
            </div>
            <div className="text-white text-5xl font-bold mb-6">{monthlyExpenses.toFixed(0)} €</div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${monthProgressPercent}%` }} />
            </div>
            <div className="mt-3 flex justify-between text-slate-400 text-xs">
              <span>1</span>
              <span>6</span>
              <span>11</span>
              <span>16</span>
              <span>21</span>
              <span>26</span>
              <span>{lastDayOfMonth}</span>
            </div>
          </section>
        </div>

        {/* Liste de surveillance - Full width */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-300">Liste de surveillance</h2>
            <span className="text-slate-400">›</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'DogeCoin', symbol: 'DOGE', pair: 'DOGE à EUR', price: '0,17 €', change: '+ 2,19 %', color: 'bg-yellow-400' }, 
              { name: 'Bitcoin', symbol: 'BTC', pair: 'BTC à EUR', price: '95 361 €', change: '+ 1,79 %', color: 'bg-orange-500' }
            ].map((c) => (
              <div key={c.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full ${c.color} flex items-center justify-center text-white font-bold`}>
                    {c.symbol[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">{c.name}</p>
                    <p className="text-slate-400 text-sm">{c.pair}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{c.price}</p>
                  <p className="text-green-400 text-sm">{c.change}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ajouter des widgets */}
        <div className="flex justify-center pb-6">
          <button className="px-4 py-3 bg-slate-800/60 border border-slate-700 text-white rounded-full text-sm">
            + Ajouter des widgets
          </button>
        </div>

        {/* Bottom Spacing for Mobile Navigation - Only on mobile */}
        <div className="h-8 lg:hidden" />
      </div>
    </div>
  );
}