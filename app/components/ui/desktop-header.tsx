'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Search, CreditCard, Bell } from 'lucide-react';

export default function DesktopHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCards, setShowCards] = useState(false);

  const mockCards = [
    { id: '1', name: 'Carte Principale', number: '**** **** **** 1234' },
    { id: '2', name: 'Carte Business', number: '**** **** **** 5678' },
  ];

  return (
    <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      {/* Logo/Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">VaelixBank</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher transactions, contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        {/* Cards Button */}
        <div className="relative">
          <button
            onClick={() => setShowCards(!showCards)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <CreditCard className="w-5 h-5 text-gray-600" />
          </button>

          {/* Cards Dropdown */}
          {showCards && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Mes Cartes</h3>
                  <button onClick={() => setShowCards(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="space-y-3">
                  {mockCards.map((card) => (
                    <div key={card.id} className="bg-gray-50 p-3 rounded-lg border">
                      <p className="font-medium text-gray-900">{card.name}</p>
                      <p className="text-sm text-gray-600">{card.number}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  Ajouter une carte
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link href="/account" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
          <Settings className="w-5 h-5 text-gray-600" />
        </Link>
      </div>
    </header>
  );
}