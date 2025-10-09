'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Search, CreditCard } from 'lucide-react';

export default function MobileHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCards, setShowCards] = useState(false);

  const mockCards = [
    { id: '1', name: 'Carte Principale', number: '**** **** **** 1234' },
    { id: '2', name: 'Carte Business', number: '**** **** **** 5678' },
  ];

  return (
    <>
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        {/* Bouton paramètres à gauche */}
        <Link href="/account" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
          <Settings className="w-5 h-5 text-gray-600" />
        </Link>

        {/* Barre de recherche au centre */}
        <div className="flex-1 mx-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bouton cartes à droite */}
        <button
          onClick={() => setShowCards(!showCards)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        >
          <CreditCard className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      {/* Modal pour les cartes */}
      {showCards && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mes Cartes</h3>
              <button onClick={() => setShowCards(false)} className="text-gray-500">✕</button>
            </div>
            <div className="space-y-3">
              {mockCards.map((card) => (
                <div key={card.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{card.name}</p>
                  <p className="text-sm text-gray-600">{card.number}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium">
              Ajouter une carte
            </button>
          </div>
        </div>
      )}
    </>
  );
}