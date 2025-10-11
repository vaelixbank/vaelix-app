'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Search, CreditCard, Bell } from 'lucide-react';
import { Icon } from '../../../lib/icon';

export default function DesktopHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCards, setShowCards] = useState(false);

  const mockCards = [
    { id: '1', name: 'Carte Principale', number: '**** **** **** 1234' },
    { id: '2', name: 'Carte Business', number: '**** **** **** 5678' },
  ];

  return (
    <header className="hidden md:flex items-center justify-between bg-gray-900 border-b border-gray-700 px-6 py-4 shadow-sm">
      {/* Logo/Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-100">VaelixBank</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Icon icon={Search} size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher transactions, contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100"
            />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
          <Icon icon={Bell} size={20} className="text-gray-400" />
        </button>

        {/* Cards Button */}
        <div className="relative">
          <button
            onClick={() => setShowCards(!showCards)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <Icon icon={CreditCard} size={20} className="text-gray-400" />
          </button>

          {/* Cards Dropdown */}
          {showCards && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-600 z-50">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-100">Mes Cartes</h3>
                  <button onClick={() => setShowCards(false)} className="text-gray-500 hover:text-gray-300">✕</button>
                </div>
                <div className="space-y-3">
                  {mockCards.map((card) => (
                     <div key={card.id} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <p className="font-medium text-gray-100">{card.name}</p>
                      <p className="text-sm text-gray-400">{card.number}</p>
                    </div>
                  ))}
                </div>
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors duration-200">
                  Ajouter une carte
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link href="/account" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
          <Icon icon={Settings} size={20} className="text-gray-400" />
        </Link>
      </div>
    </header>
  );
}