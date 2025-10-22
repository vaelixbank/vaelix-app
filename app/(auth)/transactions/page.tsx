'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { TransactionItem } from '../../components/ui/transaction-item';
import { Icon } from '../../../lib/icon';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  MoreHorizontal
} from 'lucide-react';

export default function Transactions() {
  const router = useRouter();
  const { transactions, getMonthlyIncome, getMonthlyExpenses } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['all', 'food', 'transport', 'shopping', 'salary', 'transfer'];
  const types = ['all', 'income', 'expense', 'transfer'];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.merchant?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: 'Toutes',
      food: 'Nourriture',
      transport: 'Transport',
      shopping: 'Shopping',
      salary: 'Salaire',
      transfer: 'Virement'
    };
    return labels[category] || category;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      all: 'Tous',
      income: 'Revenus',
      expense: 'Dépenses',
      transfer: 'Virements'
    };
    return labels[type] || type;
  };

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

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Pattern - matching dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Futuristic cityscape effect */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-l from-teal-500/10 to-transparent rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-2xl bg-slate-800/60 backdrop-blur-sm shadow-lg hover:bg-slate-700/60"
            >
              <Icon icon={ArrowLeft} size={20} className="text-slate-300" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Transactions</h1>
              <p className="text-slate-400 text-sm">Historique de vos opérations</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-800/60 backdrop-blur-sm shadow-lg hover:bg-slate-700/60">
              <Icon icon={MoreHorizontal} size={20} className="text-slate-300" />
            </Button>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="revolut-card-success p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80 font-medium">Revenus</p>
                <p className="text-xl font-bold text-white">€{monthlyIncome.toLocaleString('fr-FR')}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon icon={TrendingUp} size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="revolut-card-danger p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80 font-medium">Dépenses</p>
                <p className="text-xl font-bold text-white">€{monthlyExpenses.toLocaleString('fr-FR')}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon icon={TrendingDown} size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Icon icon={Search} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une transaction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
              variant="banking"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">Catégorie</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory(category)}
                  className="rounded-full"
                >
                  {getCategoryLabel(category)}
                </Button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">Type</p>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className="rounded-full"
                >
                  {getTypeLabel(type)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''}
            </h2>
            <Button variant="ghost" size="sm" className="text-primary">
              <Icon icon={Download} size={16} className="mr-1" />
              Exporter
            </Button>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon={Wallet} size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucune transaction trouvée</h3>
              <p className="text-slate-400 text-sm">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction, index) => (
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
                  showDetails={true}
                  variant="revolut"
                  className="animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    // Handle transaction details
                    console.log('Transaction details:', transaction);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
}