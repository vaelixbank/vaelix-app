'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import { Icon } from '../../../lib/icon';
import {
  Search,
  BarChart3,
  CreditCard,
  Plus,
  ArrowUpDown,
  Building2,
  MoreHorizontal,
  X,
  ChevronUp,
  Gift,
  Heart
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showPromo, setShowPromo] = useState(true);
  
  const { 
    user, 
    transactions, 
    getTotalBalance, 
    setLoading,
    isAuthenticated
  } = useStore();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoading(false);
    }, 1000);

    if (!isAuthenticated) {
      router.push('/login');
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, setLoading]);

  // Memoized values for performance - moved before early returns
  const totalBalance = useMemo(() => getTotalBalance(), [getTotalBalance]);
  const recentTransactions = useMemo(() => transactions.slice(0, 3), [transactions]);

  const getCurrentTime = useCallback(() => {
    return new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  // Memoized handlers
  const handleToggleBalance = useCallback(() => {
    setShowBalance(!showBalance);
  }, [showBalance]);

  const handleClosePromo = useCallback(() => {
    setShowPromo(false);
  }, []);

  const handleTransactionClick = useCallback(() => {
    router.push('/transactions');
  }, [router]);

  if (isLoading) {
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

      <div className="relative z-10 max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Header - Exact Revolut style */}
        <div className="flex items-center justify-between pt-2">
          {/* Left: Time + Arrow */}
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium text-lg">{getCurrentTime()}</span>
            <Icon icon={ChevronUp} size={16} className="text-white/60" />
          </div>
          
          {/* Center: Avatar + Search + Icons */}
          <div className="flex items-center space-x-3 flex-1 justify-center">
            {/* Avatar with notification */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">VB</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-xs">
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
              <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                <Icon icon={BarChart3} size={18} className="text-slate-300" />
              </button>
              <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                <Icon icon={CreditCard} size={18} className="text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Balance Section - Exact Revolut style */}
        <div className="text-center space-y-4">
          <p className="text-slate-400 text-sm">Personnel · EUR</p>
          <div className="text-7xl font-bold text-white">
            {showBalance ? `${totalBalance.toFixed(2).replace('.', ',')} €` : '••••••'}
          </div>
          <button 
            onClick={handleToggleBalance}
            className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-white text-sm font-medium transition-colors"
          >
            Comptes et Portefeuilles
          </button>
        </div>
        
        {/* Carousel Indicators - 5 dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
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

        {/* Promotional Banner - Exact Revolut style */}
        {showPromo && (
          <div className="relative bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
            <button 
              onClick={handleClosePromo}
              className="absolute top-3 right-3 p-1 hover:bg-slate-700/50 rounded-full transition-colors"
            >
              <Icon icon={X} size={16} className="text-slate-400" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">Ami invité = 70 € gagnés</h3>
                <p className="text-slate-400 text-sm">70 € par ami inscrit avant le 21 octobre. Voir CG.</p>
              </div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Icon icon={Gift} size={24} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon icon={Heart} size={12} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
}