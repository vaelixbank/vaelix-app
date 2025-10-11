'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  TrendingUp,
  Send,
  Bitcoin,
  User,
  CreditCard,
  ArrowDownLeft
} from 'lucide-react';
import { Icon } from '../../../lib/icon';

const menuItems = [
  { name: 'Accueil', href: '/dashboard', icon: Home, description: 'Tableau de bord' },
  { name: 'Virements', href: '/send', icon: Send, description: 'Envoyer de l\'argent' },
  { name: 'Demander', href: '/request', icon: ArrowDownLeft, description: 'Demander un paiement' },
  { name: 'Cartes', href: '/cards', icon: CreditCard, description: 'Gérer vos cartes' },
  { name: 'Investir', href: '/invest', icon: TrendingUp, description: 'Investissements' },
  { name: 'Cryptos', href: '/cryptos', icon: Bitcoin, description: 'Cryptomonnaies' },
  { name: 'Account', href: '/account', icon: User, description: 'Mon profil' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
      {/* Sidebar backdrop for mobile (hidden on desktop) */}
      <div className="fixed inset-0 z-40 hidden bg-gray-600 bg-opacity-75 lg:hidden" />

      {/* Sidebar content */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 border-r border-gray-700 px-6 pb-4 shadow-lg">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-white">VB</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-100">VaelixBank</h1>
              <p className="text-xs text-gray-400">Banque digitale</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-primary'
                        }`}
                      >
                        <Icon
                          icon={item.icon}
                          size={20}
                          className={`shrink-0 ${
                            isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'
                          }`}
                          aria-hidden="true"
                        />
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                           <span className={`text-xs ${
                             isActive ? 'text-primary-foreground/80' : 'text-gray-400'
                           }`}>
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Quick Actions */}
            <li className="mt-auto">
              <div className="rounded-lg bg-gray-800 p-4">
                <h3 className="text-sm font-medium text-gray-100 mb-2">Actions rapides</h3>
                <div className="space-y-2">
                  <Link
                    href="/send"
                    className="flex items-center gap-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Icon icon={Send} size={16} />
                    Nouveau virement
                  </Link>
                  <Link
                    href="/cards"
                    className="flex items-center gap-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Icon icon={CreditCard} size={16} />
                    Ajouter une carte
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}