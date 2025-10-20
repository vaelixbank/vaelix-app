'use client';

import { forwardRef } from 'react';
import { Card, CardContent } from './card';
import { Icon } from '../../../lib/icon';
import { cn } from '../../lib/utils';

export interface QuickActionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  onPress?: () => void;
}

const QuickAction = forwardRef<HTMLDivElement, QuickActionProps>(
  ({ 
    className, 
    title, 
    description,
    icon: IconComponent, 
    variant = 'default',
    size = 'default',
    disabled = false,
    onPress,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'bg-card hover:bg-accent border-border',
      primary: 'bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary',
      success: 'bg-success/10 hover:bg-success/20 border-success/20 text-success',
      warning: 'bg-warning/10 hover:bg-warning/20 border-warning/20 text-warning',
      destructive: 'bg-destructive/10 hover:bg-destructive/20 border-destructive/20 text-destructive',
    };

    const sizeClasses = {
      sm: 'p-3',
      default: 'p-4',
      lg: 'p-6',
    };

    const iconSizeClasses = {
      sm: 'w-8 h-8',
      default: 'w-12 h-12',
      lg: 'w-16 h-16',
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-200 cursor-pointer group active:scale-95',
          variantClasses[variant],
          sizeClasses[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={disabled ? undefined : onPress}
        {...props}
      >
        <CardContent className="p-0">
          <div className="flex flex-col items-center text-center space-y-2">
            {/* Icon */}
            <div className={cn(
              'rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110',
              iconSizeClasses[size],
              variant === 'default' ? 'bg-primary/10 text-primary' : 'bg-current/10'
            )}>
              <IconComponent className={cn(
                size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
              )} />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h3 className={cn(
                'font-semibold',
                size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
              )}>
                {title}
              </h3>
              {description && (
                <p className={cn(
                  'text-muted-foreground',
                  size === 'sm' ? 'text-xs' : 'text-xs'
                )}>
                  {description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
QuickAction.displayName = 'QuickAction';

export { QuickAction };
