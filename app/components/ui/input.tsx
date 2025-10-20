import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: 'default' | 'banking';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, variant = 'default', ...props }, ref) => {
    const baseClasses = 'flex h-12 w-full rounded-xl border bg-input px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200';

    const variantClasses = {
      default: 'border-border focus-visible:border-primary',
      banking: 'border-primary/20 focus-visible:border-primary bg-gradient-to-r from-background to-primary/5',
    };

    const errorClasses = error ? 'border-destructive focus-visible:ring-destructive' : '';

    return (
      <input
        type={type}
        className={cn(
          baseClasses,
          variantClasses[variant],
          errorClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };