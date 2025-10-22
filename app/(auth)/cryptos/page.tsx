'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '../../lib/store';
import { ArrowLeft } from 'lucide-react';

import { Button } from '../../components/ui/button';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  balance: number;
  icon: string;
}

export default function Cryptos() {
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = '/login';
    }
  }, []);

  const cryptos: Crypto[] = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 45000,
      change: 2.5,
      balance: 0.5,
      icon: '₿'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2800,
      change: -1.2,
      balance: 2.1,
      icon: 'Ξ'
    },
    {
      id: 'bnb',
      name: 'Binance Coin',
      symbol: 'BNB',
      price: 320,
      change: 0.8,
      balance: 10,
      icon: 'B'
    },
    {
      id: 'ada',
      name: 'Cardano',
      symbol: 'ADA',
      price: 0.45,
      change: 3.1,
      balance: 500,
      icon: '₳'
    }
  ];

  const totalValue = cryptos.reduce((total, crypto) => total + (crypto.price * crypto.balance), 0);

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
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
            <h1 className="text-xl font-bold text-white">Cryptomonnaies</h1>
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
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Valeur totale du portefeuille</p>
              <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
              <p className="text-sm opacity-80">+5.2% cette semaine</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">₿</span>
              </div>
            </div>
          </div>
        </div>

        {/* Crypto List */}
        <div className="space-y-4">
          {cryptos.map((crypto, index) => (
             <div key={crypto.id} className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover-lift animate-fade-in hover-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{crypto.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{crypto.name}</h3>
                      <p className="text-sm text-slate-400">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">${crypto.price.toLocaleString()}</p>
                    <p className={`text-sm font-medium ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-slate-400">Balance</p>
                    <p className="font-semibold text-white">{crypto.balance} {crypto.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Valeur</p>
                    <p className="font-semibold text-white">${(crypto.price * crypto.balance).toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" size="lg">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Acheter
                  </Button>
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700" size="lg">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Vendre
                  </Button>
                </div>
              </div>
          ))}

          {/* Add New Crypto */}
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-slate-600 hover:border-slate-500 transition-colors duration-200 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Nouvelle crypto</h3>
              <p className="text-slate-400">Ajoutez une nouvelle cryptomonnaie à votre portefeuille</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}