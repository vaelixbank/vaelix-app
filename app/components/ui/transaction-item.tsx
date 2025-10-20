'use client';

import { forwardRef } from 'react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Icon } from '../../../lib/icon';
import { cn } from '../../lib/utils';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Smartphone, 
  ShoppingBag, 
  Car, 
  Home, 
  Coffee,
  MoreHorizontal
} from 'lucide-react';

export interface TransactionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  type?: 'income' | 'expense' | 'transfer';
  status?: 'completed' | 'pending' | 'failed';
  merchant?: string;
  showDetails?: boolean;
  variant?: 'default' | 'revolut';
  onPress?: () => void;
}

const TransactionItem = forwardRef<HTMLDivElement, TransactionItemProps>(
  ({ 
    className, 
    amount, 
    description, 
    date, 
    category,
    type = 'expense',
    status = 'completed',
    merchant,
    showDetails = false,
    variant = 'revolut',
    onPress,
    ...props 
  }, ref) => {
    const isIncome = amount > 0;
    const isExpense = amount < 0;
    const isTransfer = type === 'transfer';

    const getCategoryIcon = (cat?: string) => {
      switch (cat?.toLowerCase()) {
        case 'food':
        case 'restaurant':
          return Coffee;
        case 'transport':
        case 'transportation':
          return Car;
        case 'shopping':
          return ShoppingBag;
        case 'housing':
        case 'rent':
          return Home;
        case 'card':
        case 'payment':
          return CreditCard;
        case 'mobile':
        case 'phone':
          return Smartphone;
        default:
          return isIncome ? ArrowDownLeft : ArrowUpRight;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed':
          return 'success';
        case 'pending':
          return 'warning';
        case 'failed':
          return 'destructive';
        default:
          return 'secondary';
      }
    };

    const formatAmount = (value: number) => {
      const absValue = Math.abs(value);
      return absValue.toLocaleString('fr-FR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      });
    };

    const CategoryIcon = getCategoryIcon(category);

    if (variant === 'revolut') {
      return (
        <div
          ref={ref}
          className={cn(
            'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.01]',
            className
          )}
          onClick={onPress}
          {...props}
        >
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm',
              isIncome 
                ? 'bg-green-100 text-green-600' 
                : isTransfer 
                ? 'bg-blue-100 text-blue-600'
                : 'bg-red-100 text-red-600'
            )}>
              <Icon icon={CategoryIcon} size={20} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-gray-900 truncate">
                    {description}
                  </h4>
                  {merchant && (
                    <p className="text-sm text-gray-600 truncate">
                      {merchant}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatDate(date)}
                    </span>
                    {category && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount and Status */}
                <div className="flex flex-col items-end space-y-1">
                  <div className={cn(
                    'text-lg font-bold',
                    isIncome ? 'text-green-600' : 'text-red-600'
                  )}>
                    {isIncome ? '+' : ''}€{formatAmount(amount)}
                  </div>
                  <div className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold',
                    status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  )}>
                    {status === 'completed' ? 'Terminé' : 
                     status === 'pending' ? 'En cours' : 'Échec'}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {showDetails && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {props.id?.slice(-8)}</span>
                    <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                      <Icon icon={MoreHorizontal} size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-200 hover:shadow-md cursor-pointer group',
          className
        )}
        onClick={onPress}
        {...props}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
              isIncome 
                ? 'bg-success/10 text-success' 
                : isTransfer 
                ? 'bg-primary/10 text-primary'
                : 'bg-destructive/10 text-destructive'
            )}>
              <Icon icon={CategoryIcon} size={20} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {description}
                  </h4>
                  {merchant && (
                    <p className="text-xs text-muted-foreground truncate">
                      {merchant}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(date)}
                    </span>
                    {category && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Badge variant="outline" size="sm">
                          {category}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount and Status */}
                <div className="flex flex-col items-end space-y-1">
                  <div className={cn(
                    'text-sm font-bold',
                    isIncome ? 'text-success' : 'text-foreground'
                  )}>
                    {isIncome ? '+' : ''}€{formatAmount(amount)}
                  </div>
                  <Badge 
                    variant={getStatusColor(status) as any} 
                    size="sm"
                  >
                    {status}
                  </Badge>
                </div>
              </div>

              {/* Additional Details */}
              {showDetails && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Transaction ID: {props.id?.slice(-8)}</span>
                    <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                      <Icon icon={MoreHorizontal} size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
TransactionItem.displayName = 'TransactionItem';

export { TransactionItem };
