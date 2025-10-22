'use client';

import { useState } from 'react';
import { Widget } from '../../../lib/widgetTypes';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, ShoppingCart, Home, Car, Utensils, CreditCard, Smartphone, Film, Heart, ArrowRightLeft, DollarSign } from 'lucide-react';
import { Icon } from '../../../../lib/icon';

interface TransactionsWidgetProps {
  widget: Widget;
  isEditMode: boolean;
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    date: string;
    category?: string;
  }>;
}

const getCategoryInitials = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'food':
    case 'restaurant':
      return 'AL';
    case 'transport':
    case 'transportation':
      return 'TR';
    case 'shopping':
      return 'SH';
    case 'housing':
    case 'rent':
      return 'HO';
    case 'card':
    case 'payment':
      return 'CA';
    case 'mobile':
    case 'phone':
      return 'MO';
    case 'entertainment':
      return 'EN';
    case 'health':
      return 'HE';
    case 'transfer':
      return 'TF';
    default:
      return 'TX';
  }
};

export function TransactionsWidget({ widget, isEditMode, transactions }: TransactionsWidgetProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 3);

  const getCategoryInitials = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
      case 'restaurant':
        return 'AL';
      case 'transport':
      case 'transportation':
        return 'TR';
      case 'shopping':
        return 'SH';
      case 'housing':
      case 'rent':
        return 'HO';
      case 'card':
      case 'payment':
        return 'CA';
      case 'mobile':
      case 'phone':
        return 'MO';
      case 'entertainment':
        return 'EN';
      case 'health':
        return 'HE';
      case 'transfer':
        return 'TF';
      default:
        return 'TX';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
      case 'restaurant':
        return Utensils;
      case 'transport':
      case 'transportation':
        return Car;
      case 'shopping':
        return ShoppingCart;
      case 'housing':
      case 'rent':
        return Home;
      case 'card':
      case 'payment':
        return CreditCard;
      case 'mobile':
      case 'phone':
        return Smartphone;
      case 'entertainment':
        return Film;
      case 'health':
        return Heart;
      case 'transfer':
        return ArrowRightLeft;
      default:
        return DollarSign;
    }
  };

  const handleTransactionClick = () => {
    if (!isEditMode) {
      router.push('/transactions');
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold">{widget.title}</h2>
        <div className="flex items-center space-x-2">
          {!isEditMode && (
            <button onClick={toggleShowAll} className="text-slate-400 hover:text-white transition-colors">
              <Icon icon={showAll ? ChevronUp : ChevronDown} size={16} />
            </button>
          )}
          {!isEditMode && <span className="text-slate-400 text-sm">›</span>}
        </div>
      </div>
      <div className="space-y-3">
        {displayedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`flex items-center space-x-4 p-3 rounded-xl transition-colors ${
              isEditMode ? 'cursor-default' : 'cursor-pointer hover:bg-slate-700/50'
            }`}
            onClick={handleTransactionClick}
          >
            {/* Transaction Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">{getCategoryInitials(transaction.category)}</span>
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
                {transaction.type === 'income' ? '+' : '-'}€
                {Math.abs(transaction.amount).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}