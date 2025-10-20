'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, ArrowUpDown, Coins, Star } from 'lucide-react';
import { Icon } from '../../../lib/icon';

const menuItems = [
  { name: 'Home', href: '/dashboard', icon: Home, label: 'Accueil' },
  { name: 'Invest', href: '/invest', icon: BarChart3, label: 'Investir' },
  { name: 'Transfer', href: '/send', icon: ArrowUpDown, label: 'Virements' },
  { name: 'Crypto', href: '/cryptos', icon: Coins, label: 'Cryptos' },
  { name: 'Points', href: '/account', icon: Star, label: 'RevPoints' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="pointer-events-none px-4 pb-3">
        {/* Floating pill container - Revolut style */}
        <div className="pointer-events-auto mx-auto max-w-md rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl shadow-black/20 animate-fade-in-up">
          <div className="flex items-center justify-between px-3 py-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex-1 inline-flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-smooth group mobile-touch-target ripple tap-highlight-none ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  {/* Active backdrop pill */}
                  {isActive && (
                    <span className="absolute inset-0 z-0 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg animate-glow" />
                  )}

                  <span className="relative z-10 flex flex-col items-center gap-1">
                    <Icon
                      icon={IconComponent}
                      size={20}
                      className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-current'}`}
                    />
                    <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}