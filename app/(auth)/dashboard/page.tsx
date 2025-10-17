'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../lib/store';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Icon } from '../../../lib/icon';
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  CreditCard,
  Eye
} from 'lucide-react';

export default function Dashboard() {
  const { user, transactions, getTotalBalance } = useStore();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      // For now, we'll use the store's default user
      // setUser(JSON.parse(userData));
    } else {
      window.location.href = '/login';
    }
  }, []);

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-12 h-12 bg-primary rounded-full"></div>
      </div>
    </div>
  );

  const totalBalance = getTotalBalance();

  const quickActions = [
    {
      title: 'Send',
      href: '/send',
      icon: ArrowUpRight,
    },
    {
      title: 'Request',
      href: '/request',
      icon: ArrowDownLeft,
    },
    {
      title: 'Top up',
      href: '/topup',
      icon: TrendingUp,
    },
    {
      title: 'Cards',
      href: '/cards',
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Good morning, {user.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your financial overview
          </p>
        </div>

        {/* Total Balance */}
        <div className="mb-8 animate-fade-in">
          <p className="text-sm text-muted-foreground font-medium">Total balance</p>
          <p className="text-3xl font-bold text-foreground">
            €{totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Accounts */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-3">Your accounts</h2>
          <div className="space-y-3">
            {user.accounts.map((account, index) => (
              <Card key={account.id} className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-left" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${account.color}20` }}
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: account.color }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-card-foreground">{account.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-card-foreground">
                        €{account.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                      </p>
                      <Icon icon={Eye} size={14} className="text-muted-foreground ml-auto mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-3">Quick actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.slice(0, 4).map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Icon icon={IconComponent} size={24} className="text-primary" />
                      </div>
                      <h3 className="font-medium text-card-foreground text-sm">{action.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Recent transactions</h2>
            <Button variant="ghost" size="sm" className="text-primary h-8 px-2" onClick={() => window.location.href = '/transactions'}>
              View all
            </Button>
          </div>
          <Card className="border border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {transactions.slice(0, 4).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <span className={`text-xs font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.description.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-card-foreground text-sm truncate">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-semibold text-sm ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}