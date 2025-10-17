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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Cards</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your payment cards</p>
          </div>
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {/* Balance Summary */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Total card balance</p>
                <p className="text-2xl font-bold text-foreground">€{cards.reduce((total, card) => total + card.balance, 0).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total limit</p>
                <p className="text-lg font-semibold text-foreground">€{cards.reduce((total, card) => total + card.limit, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{width: `${(cards.reduce((total, card) => total + card.balance, 0) / cards.reduce((total, card) => total + card.limit, 0)) * 100}%`}}></div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="space-y-3">
          {cards.map((card, index) => (
             <Card key={card.id} className="border border-border animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
               <CardContent className="p-4">
                 <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center space-x-3">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.type === 'debit' ? 'bg-purple-50' : card.type === 'business' ? 'bg-green-50' : 'bg-orange-50'}`}>
                       {getCardIcon(card.type)}
                     </div>
                     <div>
                       <h3 className="font-medium text-card-foreground text-sm">{card.name}</h3>
                       <p className="text-xs text-muted-foreground">{card.number}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold text-card-foreground">€{card.balance.toFixed(2)}</p>
                     <p className="text-xs text-muted-foreground">Exp {card.expiry}</p>
                   </div>
                 </div>

                 {/* Wallet Actions */}
                 <div className="space-y-2">
                   {walletError && (
                     <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                       <p className="text-red-600 text-xs">{walletError}</p>
                     </div>
                   )}

                   {/* Apple Pay - iOS only */}
                   {isIOS() && WalletService.isApplePaySupported() && (
                     <Button
                       onClick={() => handleAddToApplePay(card)}
                       disabled={walletLoading === `apple_${card.id}` || isCardInWallet(card.id, 'apple_pay')}
                       variant={isCardInWallet(card.id, 'apple_pay') ? "secondary" : "default"}
                       size="sm"
                       className="w-full"
                     >
                       {walletLoading === `apple_${card.id}` ? (
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                       ) : isCardInWallet(card.id, 'apple_pay') ? (
                         'Added to Apple Wallet'
                       ) : (
                         'Add to Apple Wallet'
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
                       className="w-full"
                     >
                       {walletLoading === `google_${card.id}` ? (
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                       ) : isCardInWallet(card.id, 'google_pay') ? (
                         'Added to Google Wallet'
                       ) : (
                         'Add to Google Wallet'
                       )}
                     </Button>
                   )}
                 </div>
               </CardContent>
             </Card>
           ))}

          {/* Add New Card */}
          <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-medium text-card-foreground mb-1">New card</h3>
              <p className="text-sm text-muted-foreground">Request a physical or virtual card</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}