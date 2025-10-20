'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Icon } from '../../../lib/icon';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Calendar,
  Target,
  Wallet,
  MoreHorizontal,
  Download
} from 'lucide-react';

export default function Analytics() {
  const router = useRouter();
  const { 
    transactions, 
    getMonthlyIncome, 
    getMonthlyExpenses, 
    getSavingsRate,
    getTotalBalance 
  } = useStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const savingsRate = getSavingsRate();
  const totalBalance = getTotalBalance();

  // Calculate spending by category
  const spendingByCategory = transactions
    .filter(t => t.type === 'expense' && t.category)
    .reduce((acc, transaction) => {
      const category = transaction.category!;
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(spendingByCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-red-500',
      transport: 'bg-blue-500',
      shopping: 'bg-green-500',
      entertainment: 'bg-purple-500',
      housing: 'bg-orange-500',
      health: 'bg-pink-500',
      salary: 'bg-emerald-500',
      transfer: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-400';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      food: 'Nourriture',
      transport: 'Transport',
      shopping: 'Shopping',
      entertainment: 'Divertissement',
      housing: 'Logement',
      health: 'Santé',
      salary: 'Salaire',
      transfer: 'Virement'
    };
    return labels[category] || category;
  };

  const getPeriodLabel = (period: string) => {
    const labels: Record<string, string> = {
      week: 'Cette semaine',
      month: 'Ce mois',
      year: 'Cette année'
    };
    return labels[period] || period;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Icon icon={BarChart3} size={32} className="text-primary" />
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
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <Icon icon={ArrowLeft} size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground text-sm">Insights financiers détaillés</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon icon={MoreHorizontal} size={20} />
          </Button>
        </div>

        {/* Period Selector */}
        <div className="flex bg-muted rounded-xl p-1">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getPeriodLabel(period)}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="gradient" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon icon={TrendingUp} size={16} className="text-success" />
              </div>
              <Badge variant="success" size="sm">
                +{savingsRate.toFixed(1)}%
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Taux d'épargne</p>
              <p className="text-lg font-bold text-foreground">{savingsRate.toFixed(1)}%</p>
            </div>
          </Card>

          <Card variant="gradient" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon icon={Wallet} size={16} className="text-primary" />
              </div>
              <Badge variant="outline" size="sm">
                Total
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Solde total</p>
              <p className="text-lg font-bold text-foreground">€{totalBalance.toLocaleString('fr-FR')}</p>
            </div>
          </Card>
        </div>

        {/* Income vs Expenses */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Icon icon={BarChart3} size={20} />
              <span>Revenus vs Dépenses</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm font-medium">Revenus</span>
                </div>
                <span className="font-bold text-success">€{monthlyIncome.toLocaleString('fr-FR')}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <span className="text-sm font-medium">Dépenses</span>
                </div>
                <span className="font-bold text-destructive">€{monthlyExpenses.toLocaleString('fr-FR')}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-destructive h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(monthlyExpenses / monthlyIncome) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Épargne nette</span>
                <span className={`font-bold ${monthlyIncome - monthlyExpenses > 0 ? 'text-success' : 'text-destructive'}`}>
                  {monthlyIncome - monthlyExpenses > 0 ? '+' : ''}€{(monthlyIncome - monthlyExpenses).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending by Category */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Icon icon={PieChart} size={20} />
              <span>Dépenses par catégorie</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon icon={PieChart} size={24} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Aucune donnée de dépenses disponible</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryData.map(({ category, amount }, index) => {
                  const percentage = (amount / monthlyExpenses) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                          <span className="text-sm font-medium">{getCategoryLabel(category)}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm">€{amount.toLocaleString('fr-FR')}</span>
                          <span className="text-xs text-muted-foreground ml-2">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getCategoryColor(category)}`}
                          style={{ 
                            width: `${percentage}%`,
                            animationDelay: `${index * 0.1}s`
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Goals */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Icon icon={Target} size={20} />
              <span>Objectifs financiers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Épargne d'urgence</p>
                  <p className="text-xs text-muted-foreground">Objectif: €5,000</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">€2,450</p>
                  <p className="text-xs text-muted-foreground">49%</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '49%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Vacances</p>
                  <p className="text-xs text-muted-foreground">Objectif: €2,000</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">€800</p>
                  <p className="text-xs text-muted-foreground">40%</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button variant="outline" className="w-full" size="lg">
          <Icon icon={Download} size={16} className="mr-2" />
          Exporter le rapport
        </Button>

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
}