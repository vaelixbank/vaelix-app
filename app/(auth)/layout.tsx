"use client";

import BottomNav from '../components/ui/bottom-nav';
import Sidebar from '../components/ui/sidebar';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:absolute lg:top-0 lg:left-0 lg:h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 pb-4 lg:pb-0">
        <div className="min-h-screen lg:min-h-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}