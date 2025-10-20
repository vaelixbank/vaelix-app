'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { BalanceCard } from '../../components/ui/balance-card';
import { TransactionItem } from '../../components/ui/transaction-item';
import { QuickAction } from '../../components/ui/quick-action';
import { Badge } from '../../components/ui/badge';
import { Icon } from '../../../lib/icon';
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  CreditCard,
  Eye,
  EyeOff,
  Wallet,
  PieChart,
  TrendingDown,
  Plus,
  MoreHorizontal
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    user, 
    accounts, 
    transactions, 
    quickActions,
    getTotalBalance, 
    getMonthlyIncome, 
    getMonthlyExpenses,
    getSavingsRate,
    setLoading,
    isAuthenticated
  } = useStore();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoading(false);
    }, 1000);

    if (!isAuthenticated) {
      router.push('/login');
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Icon icon={Wallet} size={32} className="text-primary" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  const totalBalance = getTotalBalance();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const savingsRate = getSavingsRate();
  const recentTransactions = transactions.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return Wallet;
      case 'savings':
        return TrendingUp;
      case 'investment':
        return PieChart;
      default:
        return Wallet;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}, {user.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Voici un aperçu de vos finances
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="rounded-full"
          >
            <Icon icon={showBalance ? EyeOff : Eye} size={20} />
          </Button>
        </div>

        {/* Total Balance Card */}
        <BalanceCard
          title="Solde total"
          amount={totalBalance}
          currency="€"
          change={savingsRate > 0 ? savingsRate : -5.2}
          changeType={savingsRate > 0 ? 'positive' : 'negative'}
          showBalance={showBalance}
          onToggleBalance={() => setShowBalance(!showBalance)}
          variant="primary"
          icon={Wallet}
          className="animate-fade-in"
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card variant="gradient" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Revenus</p>
                <p className="text-lg font-bold text-foreground">
                  {showBalance ? `€${monthlyIncome.toLocaleString('fr-FR')}` : '••••'}
                </p>
              </div>
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon icon={TrendingUp} size={16} className="text-success" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Dépenses</p>
                <p className="text-lg font-bold text-foreground">
                  {showBalance ? `€${monthlyExpenses.toLocaleString('fr-FR')}` : '••••'}
                </p>
              </div>
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Icon icon={TrendingDown} size={16} className="text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Accounts */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Mes comptes</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              <Icon icon={Plus} size={16} className="mr-1" />
              Ajouter
            </Button>
          </div>
          
          <div className="space-y-3">
            {accounts.map((account, index) => {
              const AccountIcon = getAccountIcon(account.type);
              return (
                <Card 
                  key={account.id} 
                  variant="banking"
                  className="animate-slide-in-left" 
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${account.color}20` }}
                        >
                          <AccountIcon 
                            size={20} 
                            style={{ color: account.color }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-card-foreground">{account.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {account.type === 'checking' ? 'Compte courant' : 
                             account.type === 'savings' ? 'Épargne' :
                             account.type === 'investment' ? 'Investissement' : account.type}
                          </p>
                          {account.iban && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {account.iban.slice(-4).padStart(4, '•')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-card-foreground">
                          {showBalance ? `€${account.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}` : '••••••'}
                        </p>
                        <Badge variant="outline" size="sm" className="mt-1">
                          {account.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-semibold text-foreground">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.filter(action => action.isEnabled).map((action, index) => {
              const IconComponent = require('lucide-react')[action.icon];
              return (
                <Link key={action.id} href={action.href}>
                  <QuickAction
                    title={action.title}
                    description={action.description}
                    icon={IconComponent}
                    variant={action.variant as any}
                    className="animate-slide-in-up"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Transactions récentes</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={() => router.push('/transactions')}
            >
              Voir tout
              <Icon icon={MoreHorizontal} size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                id={transaction.id}
                amount={transaction.amount}
                description={transaction.description}
                date={transaction.date}
                category={transaction.category}
                type={transaction.type}
                status={transaction.status}
                merchant={transaction.merchant}
                className="animate-slide-in-up"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                onPress={() => router.push('/transactions')}
              />
            ))}
          </div>
        </div>

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
}