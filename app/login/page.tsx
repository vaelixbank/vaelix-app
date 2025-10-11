'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Icon } from '../../lib/icon';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock login
      if (email === 'admin' && password === 'admin') {
        localStorage.setItem('user', JSON.stringify({
          email: 'admin@vaelix.com',
          name: 'Admin',
          balance: 10000
        }));
      } else if (email && password) {
        localStorage.setItem('user', JSON.stringify({
          email,
          balance: 1000
        }));
      } else {
        throw new Error('Veuillez saisir vos identifiants');
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-gray-900 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon icon={Shield} size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100">VaelixBank</h1>
          <p className="text-gray-400 mt-2">Votre banque digitale de confiance</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-100">Connexion</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Accédez à votre compte bancaire sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4" role="form" aria-label="Formulaire de connexion">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in" role="alert" aria-live="polite" id="login-error">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Adresse email
                </label>
                <div className="relative">
                  <Icon icon={Mail} size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <Icon icon={Lock} size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    aria-describedby={error ? "login-error" : undefined}
                  />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      <Icon icon={showPassword ? EyeOff : Eye} size={16} />
                    </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-400">Se souvenir de moi</span>
                </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/70 transition-colors"
                  >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:text-primary/70 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
              <p className="text-xs font-medium text-gray-300 mb-2">Identifiants de démonstration :</p>
              <div className="text-xs text-gray-400 space-y-1">
                <p><strong>Email :</strong> admin</p>
                <p><strong>Mot de passe :</strong> admin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p>Protégé par un cryptage bancaire de niveau bancaire</p>
          <p className="mt-1">© 2024 VaelixBank. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}