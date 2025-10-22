'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { Icon } from '../../../lib/icon';
import { X, MapPin, Plus, Link } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  currency: string;
  number: string;
  expiry: string;
  status: string;
  type: 'euro' | 'yen' | 'usd' | 'ephemeral';
  gradient: string;
  logoColor: string;
}

export default function Cards() {
  const router = useRouter();
  const { isAuthenticated } = useStore();
  const [currentTime, setCurrentTime] = useState('10:00');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }

    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  const handleClose = () => {
    router.back();
  };

  const cards: Card[] = [
    {
      id: '1',
      name: 'Liam Dispa Euro',
      currency: 'EUR',
      number: '..5057, 06/29',
      expiry: '06/29',
      status: 'active',
      type: 'euro',
      gradient: 'from-purple-500 to-pink-500',
      logoColor: 'text-white'
    },
    {
      id: '2',
      name: 'Liam Dispa Yen',
      currency: 'JPY',
      number: 'Prête à l\'emploi',
      expiry: '',
      status: 'ready',
      type: 'yen',
      gradient: 'from-gray-800 to-gray-900',
      logoColor: 'text-white'
    },
    {
      id: '3',
      name: 'Liam Dispa US',
      currency: 'USD',
      number: 'Prête à l\'emploi',
      expiry: '',
      status: 'ready',
      type: 'usd',
      gradient: 'from-white to-gray-100',
      logoColor: 'text-red-500'
    },
    {
      id: '4',
      name: 'Éphémère',
      currency: '',
      number: 'De nouvelles informations sont générées après chaque utilisation.',
      expiry: '',
      status: 'ephemeral',
      type: 'ephemeral',
      gradient: 'from-pink-400 to-pink-500',
      logoColor: 'text-red-500'
    }
  ];

  const getCardIcon = (type: string) => {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
        <span className="text-white font-bold text-sm">R</span>
      </div>
    );
  };

  const getChipIcon = () => {
    return (
      <div className="w-6 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
        <div className="w-3 h-2 bg-orange-300 rounded-sm"></div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return null;
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

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-6">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium text-lg">{currentTime}</span>
        </div>
        <button 
          onClick={handleClose}
          className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
        >
          <Icon icon={X} size={20} className="text-white" />
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Cartes</h1>
      </div>

      {/* Cards List */}
      <div className="px-4 space-y-4 mb-8">
        {cards.map((card, index) => (
          <div 
            key={card.id}
            onClick={() => router.push(`/cards/${card.id}`)}
            className="relative bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-6 shadow-lg cursor-pointer hover:from-slate-600 hover:to-slate-700 transition-all duration-200"
          >
            {/* Card Visual */}
            <div className={`w-full h-24 rounded-xl bg-gradient-to-r ${card.gradient} p-4 mb-4 relative overflow-hidden`}>
              {/* Card Logo */}
              <div className="absolute top-3 left-3">
                {getCardIcon(card.type)}
              </div>
              
              {/* VISA Logo for some cards */}
              {card.type === 'yen' && (
                <div className="absolute top-3 left-12">
                  <span className="text-white font-bold text-xs">VISA</span>
                </div>
              )}
              
              {/* Chip Icon */}
              {(card.type === 'euro' || card.type === 'usd' || card.type === 'ephemeral') && (
                <div className="absolute bottom-3 right-3">
                  {getChipIcon()}
                </div>
              )}
            </div>

            {/* Card Info */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{card.name}</h3>
                <p className="text-slate-400 text-sm">{card.number}</p>
              </div>
              
              {/* Currency Button */}
              {card.currency && (
                <div className="flex items-center space-x-2 bg-slate-600 rounded-full px-3 py-1">
                  <Icon icon={Link} size={14} className="text-slate-300" />
                  <span className="text-white text-sm font-medium">{card.currency}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="px-4 space-y-4">
        {/* Find ATMs Button */}
        <button className="w-full bg-slate-700 hover:bg-slate-600 rounded-2xl p-4 flex items-center justify-between transition-colors">
          <div className="flex items-center space-x-3">
            <Icon icon={MapPin} size={20} className="text-slate-300" />
            <span className="text-white font-medium">Trouver des DAB à proximité</span>
          </div>
          <Icon icon={X} size={16} className="text-slate-400 rotate-45" />
        </button>

        {/* Reactivate Card Text */}
        <div className="text-center py-2">
          <p className="text-slate-400 text-sm">
            Vous souhaitez réactiver une carte résiliée ?
          </p>
        </div>

        {/* Add Button */}
        <button className="w-full bg-slate-800 hover:bg-slate-700 rounded-2xl p-4 flex items-center justify-center space-x-2 transition-colors text-white">
          <Icon icon={Plus} size={20} className="text-slate-900" />
          <span className="text-slate-900 font-semibold">Ajouter</span>
        </button>
      </div>

      {/* Bottom Spacing for Mobile Navigation */}
      <div className="h-20" />
    </div>
  );
}