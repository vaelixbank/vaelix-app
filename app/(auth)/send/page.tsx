/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';



export default function Send() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
  const addTransaction = useStore((state) => state.addTransaction);
  const walletCards = useStore((state) => state.getWalletCards());

  useEffect(() => {
    // Check if Apple Pay is available (in Capacitor environment)
    if (typeof window !== 'undefined' && (window as any).ApplePaySession) {
      const merchantIdentifier = 'merchant.vaelixbank.app';
      const promise = (window as any).ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
      promise.then((canMakePayments: boolean) => {
        setApplePayAvailable(canMakePayments);
      });
    }

    // Check if Google Pay is available
    if (typeof window !== 'undefined' && (window as any).GooglePay) {
      // This would be from the Capacitor plugin
      // For demo purposes, assume it's available on Android
      const isAndroid = /Android/i.test(navigator.userAgent);
      setGooglePayAvailable(isAndroid);
    }
  }, []);

  const handleSend = () => {
    // Mock send
    const transaction = {
      id: Date.now().toString(),
      amount: -parseFloat(amount),
      description: `Sent to ${recipient}`,
      date: new Date().toISOString().split('T')[0],
      type: 'expense' as const,
      status: 'completed' as const,
      accountId: '1',
    };
    addTransaction(transaction);
    alert(`Sent $${amount} to ${recipient}`);
    router.push('/dashboard');
  };

  const handleApplePay = async () => {
    if (!applePayAvailable) return;

    try {
      // Apple Pay payment request
      const paymentRequest = {
        countryCode: 'FR',
        currencyCode: 'EUR',
        merchantCapabilities: ['supports3DS'],
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        total: {
          label: 'VaelixBank Transfer',
          amount: amount
        }
      };

      const session = new ((window as any).ApplePaySession)(3, paymentRequest);

      session.onvalidatemerchant = async (event: any) => {
        // Validate merchant with your server
        // This would typically call your backend to validate with Apple
        console.log('Validating merchant...', event);
      };

      session.onpaymentauthorized = (event: any) => {
        // Process the payment
        const payment = event.payment;
        console.log('Payment authorized:', payment);

        // Complete the transaction
        const transaction = {
          id: Date.now().toString(),
          amount: -parseFloat(amount),
          description: `Apple Pay: Sent to ${recipient}`,
          date: new Date().toISOString().split('T')[0],
          type: 'expense' as const,
          status: 'completed' as const,
          accountId: '1',
        };
        addTransaction(transaction);

        session.completePayment((window as any).ApplePaySession.STATUS_SUCCESS);
        alert(`Sent $${amount} to ${recipient} via Apple Pay`);
        router.push('/dashboard');
      };

      session.begin();
    } catch (error) {
      console.error('Apple Pay error:', error);
      alert('Apple Pay is not available on this device');
    }
  };

  const handleGooglePay = async () => {
    if (!googlePayAvailable) return;

    try {
      // Google Pay payment request
      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA']
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId'
              }
            }
          }
        ],
        merchantInfo: {
          merchantId: '12345678901234567890',
          merchantName: 'VaelixBank'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: amount,
          currencyCode: 'EUR',
          countryCode: 'FR'
        }
      };

      // This would use the Capacitor Google Pay plugin
      // For demo, simulate the payment
      console.log('Processing Google Pay payment...', paymentDataRequest);

      // Simulate successful payment
      const transaction = {
        id: Date.now().toString(),
        amount: -parseFloat(amount),
        description: `Google Pay: Sent to ${recipient}`,
        date: new Date().toISOString().split('T')[0],
        type: 'expense' as const,
        status: 'completed' as const,
        accountId: '1',
      };
      addTransaction(transaction);

      alert(`Sent $${amount} to ${recipient} via Google Pay`);
      router.push('/dashboard');
    } catch (error) {
      console.error('Google Pay error:', error);
      alert('Google Pay payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Pattern - matching dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Futuristic cityscape effect */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-l from-teal-500/10 to-transparent rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">Envoyer de l&apos;argent</h1>
          <p className="text-slate-400 mt-2">Transférez des fonds en toute sécurité</p>
        </div>

        {/* Send Form */}
        <Card className="shadow-xl border-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Détails du transfert</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipient" className="text-sm font-medium text-slate-300">
                  Destinataire
                </label>
                <Input
                  id="recipient"
                  name="recipient"
                  type="text"
                  required
                  placeholder="Email ou téléphone du destinataire"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-slate-300">
                  Montant
                </label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  placeholder="Montant en €"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Méthode de paiement</label>
                <div className="space-y-2">
                   <label className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                     <input
                       type="radio"
                       name="paymentMethod"
                       value="bank"
                       checked={paymentMethod === 'bank'}
                       onChange={(e) => setPaymentMethod(e.target.value)}
                       className="mr-3 text-primary"
                     />
                     <span className="text-sm font-medium text-white">Virement bancaire</span>
                   </label>
                  {applePayAvailable && (
                    <label className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="applepay"
                        checked={paymentMethod === 'applepay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-primary"
                      />
                      <span className="text-sm font-medium text-white">Apple Pay</span>
                    </label>
                  )}
                  {googlePayAvailable && (
                    <label className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="googlepay"
                        checked={paymentMethod === 'googlepay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-primary"
                      />
                      <span className="text-sm font-medium text-white">Google Pay</span>
                    </label>
                  )}

                  {/* Wallet Cards */}
                  {walletCards.filter(card => card.status === 'active').length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-300 mb-2">Cartes dans le portefeuille</p>
                      <div className="space-y-2">
                        {walletCards.filter(card => card.status === 'active').map((walletCard) => (
                          <label key={walletCard.id} className="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={`wallet_${walletCard.id}`}
                              checked={paymentMethod === `wallet_${walletCard.id}`}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="mr-3 text-primary"
                            />
                            <div className="flex items-center">
                              {walletCard.walletType === 'apple_pay' ? (
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                              )}
                              <span className="text-sm font-medium capitalize">
                                {walletCard.walletType === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} - Carte ****{walletCard.cardId.slice(-4)}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {paymentMethod === 'bank' ? (
                <Button type="submit" className="w-full" size="lg">
                  Envoyer l&apos;argent
                </Button>
              ) : paymentMethod.startsWith('wallet_') ? (
                <Button type="submit" className="w-full" size="lg" variant="secondary">
                  Payer avec la carte portefeuille
                </Button>
              ) : paymentMethod === 'applepay' ? (
                <Button
                  type="button"
                  onClick={handleApplePay}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Payer avec Apple Pay
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleGooglePay}
                  className="w-full"
                  size="lg"
                  style={{ backgroundColor: '#4285F4', color: 'white' }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Payer avec Google Pay
                </Button>
              )}

              <div className="text-center pt-4">
                <Link href="/dashboard" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Retour au tableau de bord
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p>Protégé par un cryptage bancaire de niveau bancaire</p>
        </div>
      </div>
    </div>
  );
}