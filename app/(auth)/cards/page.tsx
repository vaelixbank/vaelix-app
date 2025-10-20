'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, useStore } from '../../lib/store';
import { WalletService, CardDetails } from '../../lib/wallet';
import { isIOS, isAndroid, isMobile } from '../../lib/utils';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Icon } from '../../../lib/icon';

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
  const [user, setUser] = useState<User | null>(null);
  const [walletLoading, setWalletLoading] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const { addWalletCard, getWalletCards } = useStore();


  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleAddToApplePay = async (card: Card) => {
    setWalletLoading(`apple_${card.id}`);
    setWalletError(null);

    try {
      // Mock card details - in real app, this would come from secure storage
      const cardDetails: CardDetails = {
        id: card.id,
        name: user?.name || 'Card Holder',
        number: card.number.replace(/\*/g, '1'), // Mock full number
        expiry: card.expiry,
        cvv: '123' // Mock CVV
      };

      const walletCard = await WalletService.addToApplePay(cardDetails);
      addWalletCard(walletCard);

      alert(`Carte ajoutée à Apple Pay avec succès !`);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : 'Erreur lors de l\'ajout à Apple Pay');
    } finally {
      setWalletLoading(null);
    }
  };

  const handleAddToGooglePay = async (card: Card) => {
    setWalletLoading(`google_${card.id}`);
    setWalletError(null);

    try {
      // Mock card details
      const cardDetails: CardDetails = {
        id: card.id,
        name: user?.name || 'Card Holder',
        number: card.number.replace(/\*/g, '1'), // Mock full number
        expiry: card.expiry,
        cvv: '123' // Mock CVV
      };

      const walletCard = await WalletService.addToGooglePay(cardDetails);
      addWalletCard(walletCard);

      alert(`Carte ajoutée à Google Pay avec succès !`);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : 'Erreur lors de l\'ajout à Google Pay');
    } finally {
      setWalletLoading(null);
    }
  };

  const isCardInWallet = (cardId: string, walletType: 'apple_pay' | 'google_pay') => {
    const walletCards = getWalletCards();
    return walletCards.some(wc => wc.cardId === cardId && wc.walletType === walletType && wc.status === 'active');
  };

  const cards: Card[] = [
    {
      id: '1',
      name: 'Carte Principale',
      number: '**** **** **** 1234',
      balance: user?.accounts[0]?.balance || 0,
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes cartes</h1>
            <p className="text-gray-600 text-sm mt-1">Gérez vos cartes bancaires et paiements</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90"
          >
            <Icon icon={Plus} size={20} className="text-gray-600" />
          </Button>
        </div>

        {/* Balance Summary */}
        <div className="revolut-card p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-white/80 font-medium">Solde total des cartes</p>
              <p className="text-3xl font-bold text-white">€{cards.reduce((total, card) => total + card.balance, 0).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 font-medium">Limite totale</p>
              <p className="text-xl font-semibold text-white">€{cards.reduce((total, card) => total + card.limit, 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div className="bg-white h-3 rounded-full transition-all duration-500" style={{width: `${(cards.reduce((total, card) => total + card.balance, 0) / cards.reduce((total, card) => total + card.limit, 0)) * 100}%`}}></div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4">
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-[1.02]" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    card.type === 'debit' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 
                    card.type === 'business' ? 'bg-gradient-to-br from-green-500 to-green-600' : 
                    'bg-gradient-to-br from-orange-500 to-orange-600'
                  }`}>
                    {getCardIcon(card.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{card.name}</h3>
                    <p className="text-sm text-gray-600">{card.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">€{card.balance.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Exp {card.expiry}</p>
                </div>
              </div>

              {/* Wallet Actions */}
              <div className="space-y-3">
                {walletError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-red-600 text-sm">{walletError}</p>
                  </div>
                )}

                {/* Apple Pay - iOS only */}
                {isIOS() && WalletService.isApplePaySupported() && (
                  <Button
                    onClick={() => handleAddToApplePay(card)}
                    disabled={walletLoading === `apple_${card.id}` || isCardInWallet(card.id, 'apple_pay')}
                    variant={isCardInWallet(card.id, 'apple_pay') ? "secondary" : "default"}
                    size="sm"
                    className="w-full rounded-xl"
                  >
                    {walletLoading === `apple_${card.id}` ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : isCardInWallet(card.id, 'apple_pay') ? (
                      'Ajouté à Apple Wallet'
                    ) : (
                      'Ajouter à Apple Wallet'
                    )}
                  </Button>
                )}

                {/* Google Pay - Android only */}
                {isAndroid() && WalletService.isGooglePaySupported() && (
                  <Button
                    onClick={() => handleAddToGooglePay(card)}
                    disabled={walletLoading === `google_${card.id}` || isCardInWallet(card.id, 'google_pay')}
                    variant={isCardInWallet(card.id, 'google_pay') ? "secondary" : "outline"}
                    size="sm"
                    className="w-full rounded-xl"
                  >
                    {walletLoading === `google_${card.id}` ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : isCardInWallet(card.id, 'google_pay') ? (
                      'Ajouté à Google Wallet'
                    ) : (
                      'Ajouter à Google Wallet'
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-gray-300 hover:border-purple-400">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon icon={Plus} size={32} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Nouvelle carte</h3>
            <p className="text-gray-600 text-sm">Demandez une carte physique ou virtuelle</p>
          </div>
        </div>

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
}