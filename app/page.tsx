'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from './lib/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-24 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
