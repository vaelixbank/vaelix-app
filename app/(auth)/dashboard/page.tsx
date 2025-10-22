'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { useApi } from '../../lib/useApi';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import { Icon } from '../../../lib/icon';
import { formatBalance } from '../../lib/utils';
import { useWidgets } from '../../lib/useWidgets';
import { WidgetContainer } from '../../components/ui/widgets/WidgetContainer';
import {
  Search,
  BarChart3,
  CreditCard,
  Plus,
  ArrowUpDown,
  Building2,
  MoreHorizontal,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [useApiData, setUseApiData] = useState(false);

  // Widget management
  const {
    widgets,
    visibleWidgets,
    isEditMode,
    setIsEditMode,
    updateWidgetPosition,
    toggleWidgetVisibility,
    addWidget,
    removeWidget,
    updateWidgetConfig,
    resetToDefault
  } = useWidgets();

  const {
    user,
    transactions,
    accounts,
    getTotalBalance,
    getMonthlyExpenses,
    getMonthlyIncome,
    getSavingsRate,
    setLoading,
    isAuthenticated
  } = useStore();

  const { loadDashboard, isLoading: apiLoading, error: apiError } = useApi();

  // Helper functions
  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
      case 'restaurant':
        return '🍽️';
      case 'transport':
      case 'transportation':
        return '🚗';
      case 'shopping':
        return '🛍️';
      case 'housing':
      case 'rent':
        return '🏠';
      case 'card':
      case 'payment':
        return '💳';
      case 'mobile':
      case 'phone':
        return '📱';
      case 'entertainment':
        return '🎬';
      case 'health':
        return '🏥';
      case 'salary':
        return '💰';
      case 'transfer':
        return '↔️';
      default:
        return '💰';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-red-500',
      transport: 'bg-blue-500',
      shopping: 'bg-green-500',
      entertainment: 'bg-purple-500',
      housing: 'bg-orange-500',
      health: 'bg-pink-500',
      salary: 'bg-emerald-500',
      transfer: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-400';
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'il y a quelques secondes';
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

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

  // Enhanced financial calculations
  const totalBalance = useMemo(() => getTotalBalance(), [getTotalBalance]);
  const monthlyIncome = useMemo(() => getMonthlyIncome(), [getMonthlyIncome]);
  const monthlyExpenses = useMemo(() => getMonthlyExpenses(), [getMonthlyExpenses]);
  const savingsRate = useMemo(() => getSavingsRate(), [getSavingsRate]);

  // Recent transactions with enhanced data
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5).map(tx => ({
      ...tx,
      isPositive: tx.type === 'income',
      categoryIcon: getCategoryIcon(tx.category || 'other'),
      formattedAmount: formatBalance(Math.abs(tx.amount)),
      timeAgo: getTimeAgo(new Date(tx.date))
    }));
  }, [transactions]);



  // Spending breakdown by category
  const spendingByCategory = useMemo(() => {
    const categories = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => {
        const category = tx.category || 'other';
        acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / monthlyExpenses) * 100,
        color: getCategoryColor(category)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [transactions, monthlyExpenses]);

  // Time calculations
  const dayOfMonth = useMemo(() => new Date().getDate(), []);
  const lastDayOfMonth = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(), []);
  const monthProgressPercent = Math.min(100, Math.max(0, Math.round((dayOfMonth / lastDayOfMonth) * 100)));

  // Quick stats
  const quickStats = useMemo(() => [
    {
      label: 'Revenus du mois',
      value: formatBalance(monthlyIncome),
      change: '+12.5%',
      trend: 'up' as const,
      icon: TrendingUp
    },
    {
      label: 'Dépenses du mois',
      value: formatBalance(monthlyExpenses),
      change: '-3.2%',
      trend: 'down' as const,
      icon: TrendingDown
    },
    {
      label: 'Taux d\'épargne',
      value: `${savingsRate.toFixed(1)}%`,
      change: '+2.1%',
      trend: 'up' as const,
      icon: PiggyBank
    },
    {
      label: 'Objectif épargne',
      value: '78%',
      change: '+5.3%',
      trend: 'up' as const,
      icon: Target
    }
  ], [monthlyIncome, monthlyExpenses, savingsRate]);


  // Memoized handlers
  const handleToggleBalance = useCallback(() => {
    setShowBalance(!showBalance);
  }, [showBalance]);

  const handleTransactionClick = useCallback(() => {
    router.push('/transactions');
  }, [router]);

  // Widget drag & drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, widgetId: string) => {
    e.dataTransfer.setData('text/plain', widgetId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    const draggedWidgetId = e.dataTransfer.getData('text/plain');

    if (draggedWidgetId && draggedWidgetId !== targetWidgetId) {
      const draggedWidget = visibleWidgets.find(w => w.id === draggedWidgetId);
      const targetWidget = visibleWidgets.find(w => w.id === targetWidgetId);

      if (draggedWidget && targetWidget) {
        updateWidgetPosition(draggedWidgetId, targetWidget.position);
      }
    }
  }, [visibleWidgets, updateWidgetPosition]);

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

        {/* Widget Edit Controls - Revolut Style */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-semibold">Tableau de bord</h2>
            <p className="text-slate-400 text-sm mt-1">
              {isEditMode ? 'Glissez-déposez pour réorganiser' : 'Personnalisez votre expérience'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {isEditMode && (
              <button
                onClick={resetToDefault}
                className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 hover:text-white text-sm rounded-xl transition-all duration-200 flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Réinitialiser</span>
              </button>
            )}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 flex items-center space-x-2 font-medium ${
                isEditMode
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
                  : 'bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isEditMode ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditMode ? 'Terminer' : 'Personnaliser'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Widgets Grid - Revolut Style */}
        <div className="grid gap-6 auto-rows-max">
          {visibleWidgets.map((widget, index) => {
            // Different layouts based on widget type for better visual hierarchy
            const getWidgetLayout = (type: string) => {
              switch (type) {
                case 'quick-stats':
                  return 'col-span-1 lg:col-span-2'; // Full width on mobile, 2 cols on desktop
                case 'spending-breakdown':
                case 'accounts':
                  return 'col-span-1'; // Single column
                case 'transactions':
                  return 'col-span-1 lg:col-span-2'; // Can be wider
                case 'watchlist':
                  return 'col-span-1';
                case 'monthly-spending':
                  return 'col-span-1';
                default:
                  return 'col-span-1';
              }
            };

            return (
              <div
                key={widget.id}
                className={`${getWidgetLayout(widget.type)} ${
                  isEditMode ? 'animate-pulse' : ''
                } transition-all duration-300`}
                style={{
                  animationDelay: isEditMode ? `${index * 50}ms` : '0ms'
                }}
              >
                <WidgetContainer
                  widget={widget}
                  isEditMode={isEditMode}
                  onRemove={removeWidget}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  totalBalance={totalBalance}
                  monthlyIncome={monthlyIncome}
                  monthlyExpenses={monthlyExpenses}
                  savingsRate={savingsRate}
                  transactions={transactions}
                  accounts={accounts}
                  spendingByCategory={spendingByCategory}
                  monthProgressPercent={monthProgressPercent}
                  lastDayOfMonth={lastDayOfMonth}
                  dayOfMonth={dayOfMonth}
                  quickStats={quickStats}
                />
              </div>
            );
          })}
        </div>

        {/* Add Widget Button - Always visible like Revolut */}
        <div className="flex justify-center pt-6 pb-4">
          <button
            onClick={() => router.push('/widgets')}
            className="px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 hover:text-white rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter des widgets</span>
          </button>
        </div>

        {/* Bottom Spacing for Mobile Navigation - Only on mobile */}
        <div className="h-8 lg:hidden" />
      </div>
    </div>
  );
}