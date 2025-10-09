'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../../../lib/store';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Bitcoin } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Quick Actions */}
      <div className="px-6 py-6 animate-fade-in">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <Link href="/send" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <ArrowUpRight className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Envoyer</span>
          </Link>
          <Link href="/request" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <ArrowDownLeft className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Demander</span>
          </Link>
          <Link href="/invest" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Investir</span>
          </Link>
          <Link href="/cryptos" className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <Bitcoin className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Crypto</span>
          </Link>
          <div className="hidden md:flex flex-col items-center p-4 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-red-600 font-bold">!</span>
            </div>
            <span className="text-xs font-medium text-gray-700">Alertes</span>
          </div>
          <div className="hidden lg:flex flex-col items-center p-4 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-yellow-600 font-bold">?</span>
            </div>
            <span className="text-xs font-medium text-gray-700">Support</span>
          </div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 md:p-8 rounded-3xl shadow-lg animate-fade-in mx-6 mb-6" style={{ animationDelay: '0.1s' }}>
        <div className="text-center md:text-left md:flex md:items-center md:justify-between">
          <div>
            <p className="text-blue-100 text-sm uppercase tracking-wide">Solde total</p>
            <p className="text-4xl md:text-5xl font-bold mt-2">${user.balance.toFixed(2)}</p>
            <p className="text-blue-200 text-sm mt-1">Disponible</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-blue-100">Cette semaine</p>
              <p className="text-2xl font-semibold text-white">+2.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="px-6 py-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Transactions Récentes</h3>
            <Link href="/transactions" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors duration-200">
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-700">
                      {transaction.description.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}${transaction.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section for Desktop */}
      <div className="hidden md:block px-6 py-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Aperçu Financier</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Dépenses ce mois</p>
            <p className="text-2xl font-bold text-red-600">-$1,250</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Revenus ce mois</p>
            <p className="text-2xl font-bold text-green-600">+$3,200</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Économies</p>
            <p className="text-2xl font-bold text-blue-600">$1,950</p>
          </div>
        </div>
      </div>
    </div>
  );
}