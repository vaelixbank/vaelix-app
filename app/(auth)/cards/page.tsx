'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Card {
  id: string;
  name: string;
  number: string;
  balance: number;
  limit: number;
  type: 'debit' | 'credit' | 'business' | 'crypto';
  status: 'active' | 'blocked' | 'frozen';
  expiry: string;
}

export default function Cards() {
  const [user, setUser] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = '/login';
    }
  }, []);

  const cards: Card[] = [
    {
      id: '1',
      name: 'Carte Principale',
      number: '**** **** **** 1234',
      balance: user?.balance || 0,
      limit: 10000,
      type: 'debit',
      status: 'active',
      expiry: '12/28'
    },
    {
      id: '2',
      name: 'Carte Business',
      number: '**** **** **** 5678',
      balance: 5000,
      limit: 15000,
      type: 'business',
      status: 'active',
      expiry: '08/27'
    },
    {
      id: '3',
      name: 'Carte Crypto',
      number: '**** **** **** 9012',
      balance: 2500,
      limit: 5000,
      type: 'crypto',
      status: 'active',
      expiry: '03/26'
    }
  ];

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'debit':
        return 'from-purple-600 via-blue-600 to-indigo-700';
      case 'business':
        return 'from-emerald-500 to-teal-600';
      case 'crypto':
        return 'from-orange-500 to-red-500';
      case 'credit':
        return 'from-pink-500 to-rose-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'business':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'crypto':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        );
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="p-2 -m-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Mes cartes</h1>
            <button className="p-2 -m-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="p-6">
        {/* Balance Summary */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Solde total des cartes</p>
              <p className="text-3xl font-bold text-gray-900">${cards.reduce((total, card) => total + card.balance, 0).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Limite totale</p>
              <p className="text-xl font-semibold text-gray-700">${cards.reduce((total, card) => total + card.limit, 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full" style={{width: `${(cards.reduce((total, card) => total + card.balance, 0) / cards.reduce((total, card) => total + card.limit, 0)) * 100}%`}}></div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4">
          {cards.map((card, index) => (
            <div key={card.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${card.type === 'debit' ? 'bg-purple-100' : card.type === 'business' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                    {getCardIcon(card.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{card.name}</h3>
                    <p className="text-sm text-gray-500">{card.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${card.balance.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Expire {card.expiry}</p>
                </div>
              </div>

              {/* Card Visual Preview */}
              <div className={`w-full h-32 rounded-xl mb-4 relative overflow-hidden ${getCardGradient(card.type)}`}>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-end text-white">
                    <div>
                      <p className="text-xs opacity-80 uppercase tracking-wide">•••• •••• •••• {card.number.slice(-4)}</p>
                    </div>
                    <div className="w-8 h-6 bg-yellow-400 rounded opacity-80"></div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Détails
                </button>
                <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Gérer
                </button>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors duration-200 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nouvelle carte</h3>
              <p className="text-gray-600">Demandez une carte physique ou virtuelle</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}