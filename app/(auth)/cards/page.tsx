'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, useStore } from '../../lib/store';
import { WalletService, CardDetails } from '../../lib/wallet';
import { isIOS, isAndroid, isMobile } from '../../lib/utils';

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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="p-2 -m-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-100">Mes cartes</h1>
              {isMobile() && (
                <p className="text-xs text-gray-400 mt-1">
                  {isIOS() ? 'Apple Wallet disponible' : isAndroid() ? 'Google Wallet disponible' : 'Portefeuille web'}
                </p>
              )}
            </div>
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
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Solde total des cartes</p>
              <p className="text-3xl font-bold text-gray-100">${cards.reduce((total, card) => total + card.balance, 0).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Limite totale</p>
              <p className="text-xl font-semibold text-gray-300">${cards.reduce((total, card) => total + card.limit, 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: `${(cards.reduce((total, card) => total + card.balance, 0) / cards.reduce((total, card) => total + card.limit, 0)) * 100}%`}}></div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4">
          {cards.map((card, index) => (
             <div key={card.id} className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700 hover-lift animate-fade-in hover-scale" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${card.type === 'debit' ? 'bg-purple-100' : card.type === 'business' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                    {getCardIcon(card.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100">{card.name}</h3>
                    <p className="text-sm text-gray-400">{card.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-100">${card.balance.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">Expire {card.expiry}</p>
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

               {/* Wallet Actions */}
               <div className="space-y-3">
                 {walletError && (
                   <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                     <p className="text-red-600 text-sm">{walletError}</p>
                   </div>
                 )}

                 {/* Platform-specific wallet button */}
                 <div className="space-y-3">
                   {/* Apple Pay - iOS only */}
                   {isIOS() && WalletService.isApplePaySupported() && (
                     <button
                       onClick={() => handleAddToApplePay(card)}
                       disabled={walletLoading === `apple_${card.id}` || isCardInWallet(card.id, 'apple_pay')}
                       className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-colors duration-200 ${
                         isCardInWallet(card.id, 'apple_pay')
                           ? 'bg-green-100 text-green-800 cursor-not-allowed'
                           : walletLoading === `apple_${card.id}`
                           ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                           : 'bg-black text-white hover:bg-gray-800'
                       }`}
                     >
                       {walletLoading === `apple_${card.id}` ? (
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                       ) : isCardInWallet(card.id, 'apple_pay') ? (
                         <>
                           <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                           </svg>
                           Ajoutée à Apple Wallet
                         </>
                       ) : (
                         <>
                           <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                           </svg>
                           Ajouter à Apple Wallet
                         </>
                       )}
                     </button>
                   )}

                   {/* Google Pay - Android only */}
                   {isAndroid() && WalletService.isGooglePaySupported() && (
                     <button
                       onClick={() => handleAddToGooglePay(card)}
                       disabled={walletLoading === `google_${card.id}` || isCardInWallet(card.id, 'google_pay')}
                       className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-colors duration-200 ${
                         isCardInWallet(card.id, 'google_pay')
                           ? 'bg-green-100 text-green-800 cursor-not-allowed'
                           : walletLoading === `google_${card.id}`
                           ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                           : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                       }`}
                       style={isCardInWallet(card.id, 'google_pay') || walletLoading === `google_${card.id}` ? {} : { backgroundColor: '#4285F4', color: 'white', border: 'none' }}
                     >
                       {walletLoading === `google_${card.id}` ? (
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                       ) : isCardInWallet(card.id, 'google_pay') ? (
                         <>
                           <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                           </svg>
                           Ajoutée à Google Wallet
                         </>
                       ) : (
                         <>
                           <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                           </svg>
                           Ajouter à Google Wallet
                         </>
                       )}
                     </button>
                   )}

                   {/* Web fallback - show both options */}
                   {!isMobile() && (
                     <div className="grid grid-cols-2 gap-3">
                       {WalletService.isApplePaySupported() && (
                         <button
                           onClick={() => handleAddToApplePay(card)}
                           disabled={walletLoading === `apple_${card.id}` || isCardInWallet(card.id, 'apple_pay')}
                           className={`flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-colors duration-200 ${
                             isCardInWallet(card.id, 'apple_pay')
                               ? 'bg-green-100 text-green-800 cursor-not-allowed'
                               : walletLoading === `apple_${card.id}`
                               ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                               : 'bg-black text-white hover:bg-gray-800'
                           }`}
                         >
                           {walletLoading === `apple_${card.id}` ? (
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                           ) : isCardInWallet(card.id, 'apple_pay') ? (
                             <>
                               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                 <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                               </svg>
                               Ajouté
                             </>
                           ) : (
                             <>
                               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                 <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                               </svg>
                               Apple Pay
                             </>
                           )}
                         </button>
                       )}

                       {WalletService.isGooglePaySupported() && (
                         <button
                           onClick={() => handleAddToGooglePay(card)}
                           disabled={walletLoading === `google_${card.id}` || isCardInWallet(card.id, 'google_pay')}
                           className={`flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-colors duration-200 ${
                             isCardInWallet(card.id, 'google_pay')
                               ? 'bg-green-100 text-green-800 cursor-not-allowed'
                               : walletLoading === `google_${card.id}`
                               ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                               : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                           }`}
                           style={isCardInWallet(card.id, 'google_pay') || walletLoading === `google_${card.id}` ? {} : { backgroundColor: '#4285F4', color: 'white', border: 'none' }}
                         >
                           {walletLoading === `google_${card.id}` ? (
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                           ) : isCardInWallet(card.id, 'google_pay') ? (
                             <>
                               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                               </svg>
                               Ajouté
                             </>
                           ) : (
                             <>
                               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                               </svg>
                               Google Pay
                             </>
                           )}
                         </button>
                       )}
                     </div>
                   )}

                   {/* No wallet support message */}
                   {isMobile() && !((isIOS() && WalletService.isApplePaySupported()) || (isAndroid() && WalletService.isGooglePaySupported())) && (
                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                       <p className="text-blue-700 text-sm text-center">
                         Portefeuille {isIOS() ? 'Apple' : 'Google'} non disponible sur cet appareil
                       </p>
                     </div>
                   )}
                 </div>

                {/* Additional Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-sm">
                    Détails
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-sm">
                    Gérer
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl p-6 border-2 border-dashed border-blue-700 hover:border-blue-600 transition-colors duration-200 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Nouvelle carte</h3>
              <p className="text-gray-400">Demandez une carte physique ou virtuelle</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}