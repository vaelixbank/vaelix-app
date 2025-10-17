'use client';

import { useState } from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { Button } from './button';
import { Icon } from '../../../lib/icon';

interface TopHeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
}

export default function TopHeader({
  title = "VaelixBank",
  showSearch = true,
  showNotifications = true,
  showSettings = true
}: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
        {/* Logo/Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">VB</span>
          </div>
          <h1 className="font-semibold text-foreground">{title}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="rounded-full"
            >
              <Icon icon={Search} size={20} />
            </Button>
          )}

          {showNotifications && (
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Icon icon={Bell} size={20} />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-medium">
                3
              </span>
            </Button>
          )}

          {showSettings && (
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon icon={Settings} size={20} />
            </Button>
          )}
        </div>
      </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Icon icon={Search} size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions, accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}
    </header>
  );
}