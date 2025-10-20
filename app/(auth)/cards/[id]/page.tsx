'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '../../../lib/store';
import { Icon } from '../../../../lib/icon';
import { ArrowLeft, HelpCircle, Eye, Snowflake, Settings, ChevronUp } from 'lucide-react';

interface Transaction {
  id: string;
  merchant: string;
  logo: string;
  description: string;
  date: string;
  time: string;
  amount?: string;
  status: 'success' | 'failed' | 'pending';
  type: 'verification' | 'purchase' | 'insufficient_balance';
}

export default function CardDetail() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useStore();
  const [currentTime, setCurrentTime] = useState('11:29');
  const [card, setCard] = useState<{
    id: string;
    name: string;
    currency: string;
    number: string;
    expiry: string;
    type: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
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

    // Mock card data based on ID
    const cardId = params?.id as string;
    if (cardId) {
      const mockCard = {
        id: cardId,
        name: 'Liam Dispa Euro',
        currency: 'EUR',
        number: '.. 5057',
        expiry: '06/29',
        type: 'euro'
      };
      setCard(mockCard);
    }
    
    setLoading(false);

    return () => clearInterval(interval);
  }, [isAuthenticated, router, params]);

  const handleBack = () => {
    router.back();
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      merchant: 'Microsoft',
      logo: 'microsoft',
      description: 'Vérification de la carte',
      date: '18 octobre',
      time: '19:47',
      status: 'success',
      type: 'verification'
    },
    {
      id: '2',
      merchant: 'Microsoft Store',
      logo: 'microsoft-store',
      description: 'Vérification de la carte',
      date: '18 octobre',
      time: '19:46',
      status: 'success',
      type: 'verification'
    },
    {
      id: '3',
      merchant: 'CV.fr',
      logo: 'cv-fr',
      description: 'Solde insuffisant',
      date: '19 septembre',
      time: '05:36',
      amount: '19,99 €',
      status: 'failed',
      type: 'insufficient_balance'
    }
  ];

  const getMerchantLogo = (logo: string) => {
    switch (logo) {
      case 'microsoft':
        return (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
              <div className="bg-red-500 rounded-sm"></div>
              <div className="bg-green-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-yellow-500 rounded-sm"></div>
            </div>
          </div>
        );
      case 'microsoft-store':
        return (
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
              <div className="bg-red-500 rounded-sm"></div>
              <div className="bg-green-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-yellow-500 rounded-sm"></div>
            </div>
          </div>
        );
      case 'cv-fr':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center relative">
            <span className="text-white font-bold text-xs">CV</span>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">×</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">?</span>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl font-semibold mb-2">Carte non trouvée</h2>
          <button 
            onClick={handleBack}
            className="text-blue-400 hover:text-blue-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium text-sm">{currentTime}</span>
          <Icon icon={ChevronUp} size={12} className="text-white/60" />
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <span className="text-white text-xs ml-2">72</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-blue-900">
        <button 
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors"
        >
          <Icon icon={ArrowLeft} size={20} className="text-white" />
        </button>
        <button className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors">
          <Icon icon={HelpCircle} size={20} className="text-white" />
        </button>
      </div>

      {/* Card Display */}
      <div className="px-4 py-6">
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 p-6 shadow-2xl">
          {/* Card Info */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-white font-semibold text-lg">{card.name}</h2>
            </div>
            <div className="flex items-center space-x-2 bg-blue-500 rounded-full px-3 py-1">
              <Icon icon={ChevronUp} size={14} className="text-white rotate-45" />
              <span className="text-white text-sm font-medium">{card.currency}</span>
            </div>
          </div>

          {/* Card Number */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-lg font-medium">{card.number}</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Mastercard Logo */}
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                <div className="w-8 h-8 bg-orange-500 rounded-full -ml-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4">
        <div className="flex justify-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-gray-700">
              <Icon icon={Eye} size={20} className="text-white" />
            </button>
            <span className="text-white text-xs text-center">Afficher les<br />informations</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-gray-700">
              <Icon icon={Snowflake} size={20} className="text-white" />
            </button>
            <span className="text-white text-xs text-center">Geler</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-gray-700">
              <Icon icon={Settings} size={20} className="text-white" />
            </button>
            <span className="text-white text-xs text-center">Paramètres</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4 py-4 space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center space-x-4 py-3">
            {getMerchantLogo(transaction.logo)}
            
            <div className="flex-1">
              <h4 className="text-white font-medium">{transaction.merchant}</h4>
              <p className="text-gray-400 text-sm">
                {transaction.date}, {transaction.time} · {transaction.description}
              </p>
            </div>
            
            {transaction.amount && (
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.status === 'failed' ? 'text-red-400 line-through' : 'text-white'
                }`}>
                  {transaction.amount}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show All Button */}
      <div className="px-4 py-6 text-center">
        <button className="text-white text-sm font-medium">
          Tout afficher
        </button>
      </div>

      {/* Bottom Spacing for Mobile Navigation */}
      <div className="h-20" />
    </div>
  );
}
