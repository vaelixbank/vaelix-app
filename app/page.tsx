'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, []);

  return <div>Redirecting...</div>;
}
