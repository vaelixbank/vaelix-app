'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Icon } from '../../lib/icon';
import { useStore } from '../lib/store';
import { Eye, EyeOff, Lock, Mail, Shield, ArrowRight, Smartphone } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { setUser, setAuthenticated } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock login validation
      if (email === 'admin' && password === 'admin') {
        const user = {
          id: '1',
          email: 'admin@vaelixbank.com',
          name: 'Admin VaelixBank',
          avatar: '',
          phone: '+33 6 12 34 56 78',
          accounts: [],
          preferences: {
            currency: 'EUR',
            language: 'fr',
            notifications: true,
            biometricAuth: true
          },
          createdAt: '2024-01-01T00:00:00Z'
        };
        setUser(user);
        setAuthenticated(true);
        router.push('/dashboard');
      } else if (email && password) {
        const user = {
          id: '2',
          email: email,
          name: 'Utilisateur',
          avatar: '',
          phone: '+33 6 12 34 56 78',
          accounts: [],
          preferences: {
            currency: 'EUR',
            language: 'fr',
            notifications: true,
            biometricAuth: false
          },
          createdAt: '2024-01-01T00:00:00Z'
        };
        setUser(user);
        setAuthenticated(true);
        router.push('/dashboard');
      } else {
        throw new Error('Veuillez saisir vos identifiants');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Icon icon={Shield} size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">VaelixBank</h1>
          <p className="text-muted-foreground text-lg">Votre banque digitale de confiance</p>
          <Badge variant="banking" className="mt-3">
            🔒 Sécurisé et fiable
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl text-center text-foreground">Connexion</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Accédez à votre compte bancaire sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex bg-muted rounded-xl p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginMethod === 'email'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon icon={Mail} size={16} />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginMethod === 'phone'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon icon={Smartphone} size={16} />
                <span>Téléphone</span>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5" role="form" aria-label="Formulaire de connexion">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm animate-fade-in flex items-center space-x-2" role="alert" aria-live="polite" id="login-error">
                  <Icon icon={Lock} size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {loginMethod === 'email' ? 'Adresse email' : 'Numéro de téléphone'}
                </label>
                <div className="relative">
                  <Icon 
                    icon={loginMethod === 'email' ? Mail : Smartphone} 
                    size={16} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                  />
                  <Input
                    id="email"
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    placeholder={loginMethod === 'email' ? 'votre@email.com' : '+33 6 12 34 56 78'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12"
                    variant="banking"
                    required
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <div className="relative">
                  <Icon icon={Lock} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12"
                    variant="banking"
                    required
                    aria-describedby={error ? "login-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    <Icon icon={showPassword ? EyeOff : Eye} size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-muted-foreground">Se souvenir de moi</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                size="lg"
                variant="banking"
                loading={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Se connecter</span>
                    <Icon icon={ArrowRight} size={16} />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
              <div className="flex items-center space-x-2 mb-3">
                <Icon icon={Shield} size={16} className="text-primary" />
                <p className="text-sm font-semibold text-foreground">Identifiants de démonstration</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email :</span>
                  <code className="text-primary font-mono bg-primary/10 px-2 py-1 rounded">admin</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mot de passe :</span>
                  <code className="text-primary font-mono bg-primary/10 px-2 py-1 rounded">admin</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="flex items-center justify-center space-x-1 mb-2">
            <Icon icon={Shield} size={12} />
            <span>Protégé par un cryptage bancaire de niveau militaire</span>
          </p>
          <p>© 2024 VaelixBank. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}