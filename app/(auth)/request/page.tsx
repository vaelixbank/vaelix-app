'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function Request() {
  const [amount, setAmount] = useState('');
  const [requester, setRequester] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    setIsLoading(true);
    // Mock request
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Requested $${amount} from ${requester}`);
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-900">Demander de l&apos;argent</h1>
          <p className="text-gray-600 mt-2">Envoyez une demande de paiement</p>
        </div>

        {/* Request Form */}
        <Card className="shadow-xl border-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Détails de la demande</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleRequest(); }} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="requester" className="text-sm font-medium text-gray-700">
                  Destinataire
                </label>
                <Input
                  id="requester"
                  name="requester"
                  type="text"
                  required
                  placeholder="Email ou téléphone du destinataire"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-gray-700">
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

              <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                {isLoading ? 'Demande en cours...' : 'Demander l\'argent'}
              </Button>

              <div className="text-center pt-4">
                <Link href="/dashboard" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Retour au tableau de bord
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p>Protégé par un cryptage bancaire de niveau bancaire</p>
        </div>
      </div>
    </div>
  );
}