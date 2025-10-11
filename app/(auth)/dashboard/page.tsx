'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Icon } from '../../../lib/icon';
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Bitcoin,
  CreditCard,
  Receipt,
  Eye,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  DollarSign,
  PiggyBank
} from 'lucide-react';

export default function Dashboard() {
  const { user, transactions, setUser } = useStore();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = '/login';
    }
  }, [setUser]);

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-12 h-12 bg-primary rounded-full"></div>
      </div>
    </div>
  );

  const quickActions = [
    {
      title: 'Envoyer',
      description: 'Virement instantané',
      href: '/send',
      icon: ArrowUpRight,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Demander',
      description: 'Paiement demandé',
      href: '/request',
      icon: ArrowDownLeft,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Investir',
      description: 'Gérer portefeuille',
      href: '/invest',
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Crypto',
      description: 'Trading crypto',
      href: '/cryptos',
      icon: Bitcoin,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Cartes',
      description: 'Gérer paiements',
      href: '/cards',
      icon: CreditCard,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50'
    },
  ];

  const monthlyStats = [
    {
      title: 'Dépenses',
      amount: -1250,
      change: -8.2,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Revenus',
      amount: 3200,
      change: 12.5,
      icon: TrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Économies',
      amount: 1950,
      change: 15.3,
      icon: PiggyBank,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">
                Bonjour, {user.name || 'Utilisateur'} 👋
              </h1>
              <p className="text-gray-400 mt-1">
                Voici un aperçu de vos finances
              </p>
            </div>
            <div className="hidden sm:block">
              <Button variant="outline" size="sm">
                <Icon icon={Eye} size={16} className="mr-2" />
                 Vue d&apos;ensemble
              </Button>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-primary/60 text-white border-0 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wide">
                  Solde disponible
                </p>
                <p className="text-4xl font-bold mt-2">
                  ${user.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center mt-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    <Icon icon={TrendingUp} size={12} className="mr-1" />
                    +2.5% ce mois
                  </Badge>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                  <Icon icon={DollarSign} size={40} className="text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                 <Link key={action.title} href={action.href}>
                   <Card className="hover-lift cursor-pointer group animate-scale-in hover-scale" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                        <Icon icon={IconComponent} size={24} className={action.color} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Icon icon={Receipt} size={20} className="mr-2" />
                  Transactions récentes
                </CardTitle>
                 <Button variant="ghost" size="sm" onClick={() => window.location.href = '/transactions'}>
                   Voir tout
                 </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction, index) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg animate-fade-in hover-lift cursor-pointer" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <span className={`text-sm font-medium ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.description.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">{transaction.description}</p>
                          <p className="text-sm text-gray-400">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Overview */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Card>
              <CardHeader>
                 <CardTitle className="text-gray-100">Aperçu du mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={stat.title} className="flex items-center justify-between animate-fade-in" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <Icon icon={IconComponent} size={20} className={stat.color} />
                          </div>
                          <div>
                             <p className="font-medium text-gray-100">{stat.title}</p>
                            <p className={`text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stat.change > 0 ? '+' : ''}{stat.change}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${stat.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.amount > 0 ? '+' : ''}${Math.abs(stat.amount)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}