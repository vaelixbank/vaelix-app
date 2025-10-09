'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Send, Bitcoin, User } from 'lucide-react';

const menuItems = [
  { name: 'Accueil', href: '/dashboard', icon: Home },
  { name: 'Investir', href: '/invest', icon: TrendingUp },
  { name: 'Virements', href: '/send', icon: Send },
  { name: 'Cartes', href: '/cards', icon: Bitcoin },
  { name: 'Account', href: '/account', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors duration-200 ${
                pathname === item.href
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-5 h-5 mb-1" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}