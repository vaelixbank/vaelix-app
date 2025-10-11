'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Send, CreditCard, User } from 'lucide-react';

const menuItems = [
  { name: 'Accueil', href: '/dashboard', icon: Home, label: 'Accueil' },
  { name: 'Virements', href: '/send', icon: Send, label: 'Virements' },
  { name: 'Cartes', href: '/cards', icon: CreditCard, label: 'Cartes' },
  { name: 'Investir', href: '/invest', icon: TrendingUp, label: 'Investir' },
  { name: 'Profil', href: '/account', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Background with blur effect */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                )}

                {/* Icon */}
                <IconComponent
                  className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />

                {/* Label */}
                <span className={`text-xs font-medium truncate ${
                  isActive ? 'text-primary' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
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