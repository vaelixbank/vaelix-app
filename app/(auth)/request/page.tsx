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
          <h1 className="text-3xl font-bold text-white">Demander de l&apos;argent</h1>
          <p className="text-slate-400 mt-2">Envoyez une demande de paiement</p>
        </div>

        {/* Request Form */}
        <Card className="shadow-xl border-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Détails de la demande</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleRequest(); }} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="requester" className="text-sm font-medium text-slate-300">
                  Demandeur
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
                <label htmlFor="amount" className="text-sm font-medium text-slate-300">
                  Montant demandé
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
        <div className="text-center text-xs text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p>Protégé par un cryptage bancaire de niveau bancaire</p>
        </div>
      </div>
    </div>
  );
}