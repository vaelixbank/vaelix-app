'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Accueil', href: '/dashboard', icon: '🏠' },
  { name: 'Investir', href: '/invest', icon: '📈' },
  { name: 'Virements', href: '/send', icon: '💸' },
  { name: 'Cryptos', href: '/cryptos', icon: '₿' },
  { name: 'Account', href: '/account', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-xl font-bold">VaelixBank</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname === item.href
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}