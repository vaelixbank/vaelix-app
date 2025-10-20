'use client';

import { cn } from '../../lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function LoadingSkeleton({ 
  className, 
  variant = 'rectangular', 
  width = '100%', 
  height = '1rem',
  lines = 1 
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    rounded: 'rounded-lg'
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              className
            )}
            style={{ 
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height,
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-3">
            <LoadingSkeleton width={60} height={20} />
            <LoadingSkeleton width={16} height={16} variant="circular" />
          </div>
          <div className="flex items-center space-x-3">
            <LoadingSkeleton width={40} height={40} variant="circular" />
            <LoadingSkeleton width={200} height={40} />
            <div className="flex space-x-2">
              <LoadingSkeleton width={32} height={32} variant="circular" />
              <LoadingSkeleton width={32} height={32} variant="circular" />
            </div>
          </div>
        </div>

        {/* Balance Section Skeleton */}
        <div className="space-y-4 text-center">
          <LoadingSkeleton width={120} height={16} className="mx-auto" />
          <LoadingSkeleton width={200} height={60} className="mx-auto" />
          <LoadingSkeleton width={180} height={40} className="mx-auto" />
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <LoadingSkeleton key={index} width={8} height={8} variant="circular" />
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="flex justify-center space-x-8 py-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <LoadingSkeleton width={56} height={56} variant="circular" />
              <LoadingSkeleton width={80} height={12} />
            </div>
          ))}
        </div>

        {/* Promotional Banner Skeleton */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <LoadingSkeleton width={200} height={20} className="mb-2" />
              <LoadingSkeleton width={250} height={14} />
            </div>
            <LoadingSkeleton width={64} height={64} variant="rounded" />
          </div>
        </div>

        {/* Transactions Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-slate-800/50 rounded-2xl p-4">
              <div className="flex items-center space-x-4">
                <LoadingSkeleton width={48} height={48} variant="rounded" />
                <div className="flex-1">
                  <LoadingSkeleton width={120} height={16} className="mb-2" />
                  <LoadingSkeleton width={180} height={14} />
                </div>
                <LoadingSkeleton width={60} height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
