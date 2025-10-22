'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '../../lib/store';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'etf' | 'mutual_fund';
  value: number;
  change: number;
  invested: number;
  icon: string;
}

export default function Invest() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = '/login';
    }
  }, []);

  const investments: Investment[] = [
    {
      id: '1',
      name: 'Tech Growth ETF',
      type: 'etf',
      value: 12500,
      change: 3.2,
      invested: 10000,
      icon: '📈'
    },
    {
      id: '2',
      name: 'Government Bonds',
      type: 'bonds',
      value: 8200,
      change: 0.8,
      invested: 8000,
      icon: '🏛️'
    },
    {
      id: '3',
      name: 'Blue Chip Stocks',
      type: 'stocks',
      value: 15200,
      change: -1.5,
      invested: 15000,
      icon: '🏢'
    },
    {
      id: '4',
      name: 'Global Mutual Fund',
      type: 'mutual_fund',
      value: 9800,
      change: 2.1,
      invested: 9500,
      icon: '🌍'
    }
  ];

  const totalValue = investments.reduce((total, inv) => total + inv.value, 0);
  const totalInvested = investments.reduce((total, inv) => total + inv.invested, 0);
  const totalReturn = totalValue - totalInvested;

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Pattern - matching dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Futuristic cityscape effect */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-l from-teal-500/10 to-transparent rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-slate-800/60 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="p-2 -m-2 text-slate-400 hover:text-white transition-colors duration-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">Investissements</h1>
            <button className="p-2 -m-2 text-slate-400 hover:text-white transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

        {/* Portfolio Summary */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Valeur totale du portefeuille</p>
                <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                <p className={`text-sm ${totalReturn > 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {totalReturn > 0 ? '+' : ''}${totalReturn.toLocaleString()} ({((totalReturn / totalInvested) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-white">Investir</h3>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">Retirer</h3>
              </CardContent>
            </Card>
          </div>

        {/* Investments List */}
        <div className="space-y-4">
          {investments.map((investment, index) => (
             <div key={investment.id} className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover-lift animate-fade-in hover-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-xl">{investment.icon}</span>
               </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">${investment.value.toLocaleString()}</p>
                    <p className={`text-sm font-medium ${investment.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {investment.change > 0 ? '+' : ''}{investment.change}%
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Investi</p>
                    <p className="font-semibold text-white">${investment.invested.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Rendement</p>
                    <p className="font-semibold text-white">${(investment.value - investment.invested).toLocaleString()}</p>
                    </div>
                 </div>
             </div>
          ))}

          {/* Add New Investment */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-dashed border-purple-200 hover:border-purple-300 transition-colors duration-200 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Nouvel investissement</h3>
              <p className="text-slate-400">Explorez de nouvelles opportunités d&apos;investissement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}