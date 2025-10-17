'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Send, CreditCard, User } from 'lucide-react';
import { Icon } from '../../../lib/icon';

const menuItems = [
  { name: 'Home', href: '/dashboard', icon: Home, label: 'Home' },
  { name: 'Cards', href: '/cards', icon: CreditCard, label: 'Cards' },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { name: 'Profile', href: '/account', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Background with blur effect */}
      <div className="bg-background/95 backdrop-blur-lg border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground active:text-primary'
                }`}
              >
                {/* Icon */}
                <Icon
                  icon={IconComponent}
                  size={20}
                  className={`mb-0.5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />

                {/* Label */}
                <span className={`text-xs font-medium truncate ${
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </nav>
  );
}