'use client';

import { Widget } from '../../../lib/widgetTypes';
import { useRouter } from 'next/navigation';

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

export function TransactionsWidget({ widget, isEditMode, transactions }: TransactionsWidgetProps) {
  const router = useRouter();

  const recentTransactions = transactions.slice(0, (widget.config?.maxItems as number) || 5);

  const handleTransactionClick = () => {
    if (!isEditMode) {
      router.push('/transactions');
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold">{widget.title}</h2>
        {!isEditMode && <span className="text-slate-400 text-sm">›</span>}
      </div>
      <div className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`flex items-center space-x-4 p-3 rounded-xl transition-colors ${
              isEditMode ? 'cursor-default' : 'cursor-pointer hover:bg-slate-700/50'
            }`}
            onClick={handleTransactionClick}
          >
            {/* Transaction Icon */}
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