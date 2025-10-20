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
import { Eye, EyeOff, Lock, Mail, Shield, ArrowRight, Smartphone, User, Check } from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const { setUser, setAuthenticated } = useStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Veuillez saisir une adresse email valide');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSignup = async () => {
    if (!formData.acceptTerms) {
      setError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const user = {
        id: Date.now().toString(),
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        avatar: '',
        phone: formData.phone,
        accounts: [],
        preferences: {
          currency: 'EUR',
          language: 'fr',
          notifications: true,
          biometricAuth: false
        },
        createdAt: new Date().toISOString()
      };

      setUser(user);
      setAuthenticated(true);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Très bon'];
  const strengthColors = ['bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-success'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Icon icon={Shield} size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">VaelixBank</h1>
          <p className="text-muted-foreground text-lg">Rejoignez la révolution bancaire</p>
          <Badge variant="banking" className="mt-3">
            🚀 Gratuit et sans engagement
          </Badge>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step <= currentStep
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step < currentStep ? <Icon icon={Check} size={16} /> : step}
            </div>
          ))}
        </div>

        {/* Signup Card */}
        <Card className="shadow-2xl border-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl text-center text-foreground">
              {currentStep === 1 && 'Informations personnelles'}
              {currentStep === 2 && 'Sécurité'}
              {currentStep === 3 && 'Finalisation'}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {currentStep === 1 && 'Renseignez vos informations de base'}
              {currentStep === 2 && 'Créez un mot de passe sécurisé'}
              {currentStep === 3 && 'Acceptez les conditions et finalisez'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm animate-fade-in flex items-center space-x-2" role="alert" aria-live="polite">
                <Icon icon={Shield} size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Prénom</label>
                    <div className="relative">
                      <Icon icon={User} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Jean"
                        className="pl-12 h-12"
                        variant="banking"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nom</label>
                    <div className="relative">
                      <Icon icon={User} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Dupont"
                        className="pl-12 h-12"
                        variant="banking"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Adresse email</label>
                  <div className="relative">
                    <Icon icon={Mail} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="jean.dupont@email.com"
                      className="pl-12 h-12"
                      variant="banking"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Security */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Numéro de téléphone</label>
                  <div className="relative">
                    <Icon icon={Smartphone} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="pl-12 h-12"
                      variant="banking"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mot de passe</label>
                  <div className="relative">
                    <Icon icon={Lock} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Minimum 8 caractères"
                      className="pl-12 pr-12 h-12"
                      variant="banking"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon icon={showPassword ? EyeOff : Eye} size={16} />
                    </button>
                  </div>
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Force du mot de passe</span>
                        <span className="font-medium">{strengthLabels[passwordStrength - 1] || 'Très faible'}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-destructive'}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Icon icon={Lock} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Répétez votre mot de passe"
                      className="pl-12 pr-12 h-12"
                      variant="banking"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon icon={showConfirmPassword ? EyeOff : Eye} size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Terms and Finalization */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Récapitulatif</h3>
                  <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nom complet</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Téléphone</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="w-5 h-5 text-primary border-border rounded focus:ring-primary focus:ring-2 mt-0.5"
                    />
                    <span className="text-sm text-muted-foreground">
                      J&apos;accepte les{' '}
                      <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                        conditions d&apos;utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                        politique de confidentialité
                      </Link>{' '}
                      de VaelixBank
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="w-full h-12"
                  size="lg"
                  variant="banking"
                >
                  <span>Continuer</span>
                  <Icon icon={ArrowRight} size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSignup}
                  className="w-full h-12"
                  size="lg"
                  variant="banking"
                  loading={isLoading}
                  disabled={!formData.acceptTerms}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Création du compte...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Icon icon={Shield} size={16} />
                      <span>Créer mon compte</span>
                    </div>
                  )}
                </Button>
              )}

              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="w-full"
                >
                  Retour
                </Button>
              )}
            </div>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
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