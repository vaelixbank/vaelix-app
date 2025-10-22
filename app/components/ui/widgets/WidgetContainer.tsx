'use client';

import React, { useState } from 'react';
import { Widget } from '../../../lib/widgetTypes';
import { TransactionsWidget } from './TransactionsWidget';
import { QuickStatsWidget } from './QuickStatsWidget';
import { SpendingBreakdownWidget } from './SpendingBreakdownWidget';
import { WatchlistWidget } from './WatchlistWidget';
import { AccountsWidget } from './AccountsWidget';
import { MonthlySpendingWidget } from './MonthlySpendingWidget';
import { SavingsGoalWidget } from './SavingsGoalWidget';
import { GripVertical, X, Settings } from 'lucide-react';

interface WidgetContainerProps {
  widget: Widget;
  isEditMode: boolean;
  onRemove?: (widgetId: string) => void;
  onDragStart?: (e: React.DragEvent, widgetId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, widgetId: string) => void;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    date: string;
    category?: string;
  }>;
  accounts: Array<{
    id: string;
    name: string;
    iban?: string;
  }>;
  spendingByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  monthProgressPercent: number;
  lastDayOfMonth: number;
  dayOfMonth: number;
  quickStats: Array<{
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

export function WidgetContainer({
  widget,
  isEditMode,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  savingsRate,
  transactions,
  accounts,
  spendingByCategory,
  monthProgressPercent,
  lastDayOfMonth,
  dayOfMonth,
  quickStats
}: WidgetContainerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderWidgetContent = () => {
    const commonProps = {
      isEditMode,
      widget
    };

    switch (widget.type) {
      case 'transactions':
        return <TransactionsWidget {...commonProps} transactions={transactions} />;
      case 'quick-stats':
        return <QuickStatsWidget {...commonProps} quickStats={quickStats} />;
      case 'spending-breakdown':
        return <SpendingBreakdownWidget {...commonProps} spendingByCategory={spendingByCategory} />;
      case 'watchlist':
        return <WatchlistWidget {...commonProps} />;
      case 'accounts':
        return <AccountsWidget {...commonProps} accounts={accounts} />;
      case 'monthly-spending':
        return (
          <MonthlySpendingWidget
            {...commonProps}
            monthlyExpenses={monthlyExpenses}
            monthProgressPercent={monthProgressPercent}
            lastDayOfMonth={lastDayOfMonth}
            dayOfMonth={dayOfMonth}
          />
        );
      case 'savings-goal':
        return <SavingsGoalWidget {...commonProps} />;
      default:
        return (
          <div className="p-4 text-center text-slate-400">
            Widget {widget.type} non implémenté
          </div>
        );
    }
  };

  return (
    <div
      className={`relative bg-slate-800/60 border border-slate-700 rounded-2xl transition-all duration-200 ${
        isEditMode ? 'hover:border-slate-600' : ''
      } ${isHovered && isEditMode ? 'ring-2 ring-blue-500/50' : ''}`}
      draggable={isEditMode}
      onDragStart={(e) => onDragStart?.(e, widget.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, widget.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditMode && (
        <div className="absolute top-3 right-3 flex items-center space-x-2 z-10">
          <div className="w-6 h-6 bg-slate-700/80 rounded flex items-center justify-center cursor-move">
            <GripVertical className="w-3 h-3 text-slate-400" />
          </div>
          <button
            onClick={() => onRemove?.(widget.id)}
            className="w-6 h-6 bg-red-600/80 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      {renderWidgetContent()}
    </div>
  );
}