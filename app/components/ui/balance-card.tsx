'use client';

import { forwardRef } from 'react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Icon } from '../../../lib/icon';
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BalanceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  amount: number;
  currency?: string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  showBalance?: boolean;
  onToggleBalance?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  icon?: React.ComponentType<{ className?: string }>;
}

const BalanceCard = forwardRef<HTMLDivElement, BalanceCardProps>(
  ({ 
    className, 
    title, 
    amount, 
    currency = '€', 
    change, 
    changeType = 'neutral',
    showBalance = true,
    onToggleBalance,
    variant = 'default',
    icon: IconComponent,
    ...props 
  }, ref) => {
    const formatAmount = (value: number) => {
      return value.toLocaleString('fr-FR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    };

    const formatChange = (value: number) => {
      const sign = value > 0 ? '+' : '';
      return `${sign}${value.toFixed(2)}%`;
    };

    const variantClasses = {
      default: 'bg-gradient-to-br from-card to-card/80',
      primary: 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20',
      success: 'bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/20',
      warning: 'bg-gradient-to-br from-warning/10 via-warning/5 to-transparent border-warning/20',
    };

    const changeColorClasses = {
      positive: 'text-success',
      negative: 'text-destructive',
      neutral: 'text-muted-foreground',
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'relative overflow-hidden transition-all duration-300 hover:scale-[1.02]',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {IconComponent && (
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
              )}
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            {onToggleBalance && (
              <button
                onClick={onToggleBalance}
                className="p-1 rounded-md hover:bg-muted/50 transition-colors"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                <Icon icon={showBalance ? Eye : EyeOff} size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Amount */}
          <div className="mb-4">
            <div className="text-3xl font-bold text-foreground">
              {showBalance ? `${currency}${formatAmount(amount)}` : '••••••'}
            </div>
            {change !== undefined && showBalance && (
              <div className="flex items-center space-x-1 mt-1">
                <Icon 
                  icon={changeType === 'positive' ? TrendingUp : changeType === 'negative' ? TrendingDown : TrendingUp} 
                  size={14} 
                  className={changeColorClasses[changeType]}
                />
                <span className={`text-sm font-medium ${changeColorClasses[changeType]}`}>
                  {formatChange(change)}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>

          {/* Change Badge */}
          {change !== undefined && showBalance && (
            <Badge 
              variant={changeType === 'positive' ? 'success' : changeType === 'negative' ? 'destructive' : 'secondary'}
              size="sm"
            >
              {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'} {formatChange(change)}
            </Badge>
          )}
        </CardContent>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
      </Card>
    );
  }
);
BalanceCard.displayName = 'BalanceCard';

export { BalanceCard };
