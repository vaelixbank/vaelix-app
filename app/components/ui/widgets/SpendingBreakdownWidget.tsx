'use client';

import { Widget } from '../../../lib/widgetTypes';

interface SpendingBreakdownWidgetProps {
  widget: Widget;
  isEditMode: boolean;
  spendingByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}

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

export function SpendingBreakdownWidget({ widget, isEditMode, spendingByCategory }: SpendingBreakdownWidgetProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">{widget.title}</h2>
        <span className="text-slate-400 text-sm">Ce mois</span>
      </div>
      <div className="space-y-3">
        {spendingByCategory.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getCategoryIcon(item.category)}</span>
              <div>
                <p className="text-white font-medium capitalize">{item.category}</p>
                <p className="text-slate-400 text-sm">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{item.amount.toFixed(2)} €</p>
              <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getCategoryColor(item.category)} transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}