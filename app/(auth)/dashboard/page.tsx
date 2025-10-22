'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { useApi } from '../../lib/useApi';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import { formatBalance } from '../../lib/utils';
import { useWidgets } from '../../lib/useWidgets';
import { WidgetContainer } from '../../components/ui/widgets/WidgetContainer';
import { DashboardHeader } from '../../components/ui/DashboardHeader';
import { BalanceSection } from '../../components/ui/BalanceSection';
import { QuickActions } from '../../components/ui/QuickActions';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Edit3,
  Check,
  RotateCcw,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  CreditCard,
  Smartphone,
  Film,
  Heart,
  ArrowRightLeft,
  DollarSign,
  Plus
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
  const getCategoryIconName = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
      case 'restaurant':
        return 'Utensils';
      case 'transport':
      case 'transportation':
        return 'Car';
      case 'shopping':
        return 'ShoppingCart';
      case 'housing':
      case 'rent':
        return 'Home';
      case 'card':
      case 'payment':
        return 'CreditCard';
      case 'mobile':
      case 'phone':
        return 'Smartphone';
      case 'entertainment':
        return 'Film';
      case 'health':
        return 'Heart';
      case 'salary':
        return 'DollarSign';
      case 'transfer':
        return 'ArrowRightLeft';
      default:
        return 'DollarSign';
    }
  };

  const getCategoryIcon = (category?: string) => {
    const iconName = getCategoryIconName(category);
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Utensils,
      Car,
      ShoppingCart,
      Home,
      CreditCard,
      Smartphone,
      Film,
      Heart,
      DollarSign,
      ArrowRightLeft
    };
    return iconMap[iconName] || DollarSign;
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
  }, [transactions, getCategoryIcon]);



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

      <div className="relative z-10 max-w-md mx-auto lg:max-w-5xl xl:max-w-6xl px-4 lg:px-6 py-4 space-y-6">
        <DashboardHeader useApiData={useApiData} setUseApiData={setUseApiData} />

        <BalanceSection
          totalBalance={totalBalance}
          showBalance={showBalance}
          useApiData={useApiData}
          apiError={apiError}
        />
        
        <QuickActions />

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
              className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 flex items-center space-x-2 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                isEditMode
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
                  : 'bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 hover:text-white'
              }`}
              aria-label={isEditMode ? 'Terminer la personnalisation' : 'Personnaliser le tableau de bord'}
              aria-expanded={isEditMode}
            >
              {isEditMode ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditMode ? 'Terminer' : 'Personnaliser'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Widgets Grid - Revolut Style */}
        <div className="grid gap-4 lg:gap-6 auto-rows-max lg:grid-cols-2 xl:grid-cols-3" role="region" aria-label="Widgets du tableau de bord" aria-live="polite">
          {visibleWidgets.map((widget, index) => {
            // Different layouts based on widget type for better visual hierarchy
            const getWidgetLayout = (type: string) => {
              switch (type) {
                case 'quick-stats':
                  return 'col-span-1 xl:col-span-2'; // Full width on mobile/tablet, 2 cols on xl
                case 'spending-breakdown':
                case 'accounts':
                  return 'col-span-1'; // Single column
                case 'transactions':
                  return 'col-span-1 xl:col-span-2'; // Can be wider on xl
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
                   isEditMode ? 'scale-105 shadow-lg shadow-purple-500/20' : ''
                 } transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
                 style={{
                   animationDelay: isEditMode ? `${index * 50}ms` : `${index * 100}ms`,
                   animationFillMode: 'both'
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