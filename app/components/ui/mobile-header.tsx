'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, X } from 'lucide-react';
import { Button } from './button';
import { Icon } from '../../../lib/icon';

export default function MobileHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { name: 'Mon profil', href: '/account', icon: '👤' },
    { name: 'Paramètres', href: '/settings', icon: '⚙️' },
    { name: 'Support', href: '/support', icon: '🆘' },
    { name: 'Déconnexion', href: '/logout', icon: '🚪' },
  ];

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VB</span>
            </div>
            <span className="font-semibold text-foreground">VaelixBank</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-9 w-9"
            >
              <Icon icon={Search} size={16} />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Icon icon={Bell} size={16} />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </Button>

            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="h-9 w-9"
            >
              <Icon icon={showMenu ? X : Menu} size={16} />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="px-6 pb-4 animate-slide-in-right">
            <div className="relative">
              <Icon icon={Search} size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher des transactions, comptes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-card shadow-xl transform transition-transform duration-300 ease-in-out border-l border-border">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-card-foreground">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMenu(false)}
                >
                  <Icon icon={X} size={20} />
                </Button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 px-6 py-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-3 text-muted-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                        onClick={() => setShowMenu(false)}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-card-foreground mb-3">Actions rapides</h3>
                  <div className="space-y-2">
                    <Link
                      href="/send"
                      className="flex items-center space-x-3 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      <span className="text-lg">💸</span>
                      <span className="text-sm font-medium">Nouveau virement</span>
                    </Link>
                    <Link
                      href="/cards"
                      className="flex items-center space-x-3 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      <span className="text-lg">💳</span>
                      <span className="text-sm font-medium">Gérer mes cartes</span>
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}