'use client';

import { forwardRef } from 'react';
import { Card, CardContent } from './card';
import { Icon } from '../../../lib/icon';
import { cn } from '../../lib/utils';

export interface QuickActionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'revolut';
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
      revolut: 'revolut-card hover:scale-105 transition-all duration-200',
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

    if (variant === 'revolut') {
      return (
        <div
          ref={ref}
          className={cn(
            'revolut-card cursor-pointer group active:scale-95 relative overflow-hidden',
            sizeClasses[size],
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={disabled ? undefined : onPress}
          {...props}
        >
          <div className="flex flex-col items-center text-center space-y-3 relative z-10">
            {/* Icon */}
            <div className={cn(
              'rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 bg-white/20 backdrop-blur-sm',
              iconSizeClasses[size]
            )}>
              <IconComponent className={cn(
                size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6',
                'text-white'
              )} />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h3 className={cn(
                'font-bold text-white',
                size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
              )}>
                {title}
              </h3>
              {description && (
                <p className={cn(
                  'text-white/80',
                  size === 'sm' ? 'text-xs' : 'text-xs'
                )}>
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
        </div>
      );
    }

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
