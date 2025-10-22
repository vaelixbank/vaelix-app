'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Icon } from '../../../lib/icon';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard,
  Settings,
  LogOut,
  Edit,
  Check,
  X,
  Camera,
  Lock,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Account() {
  const router = useRouter();
  const { user, setUser, setAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'fr',
    notifications: true,
    biometricAuth: true
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
        language: user.preferences?.language || 'fr',
        notifications: user.preferences?.notifications || true,
        biometricAuth: user.preferences?.biometricAuth || false
      });
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setAuthenticated(false);
    router.push('/login');
  };

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferences: {
          ...user.preferences,
          language: formData.language,
          notifications: formData.notifications,
          biometricAuth: formData.biometricAuth
        }
      };
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
        language: user.preferences?.language || 'fr',
        notifications: user.preferences?.notifications || true,
        biometricAuth: user.preferences?.biometricAuth || false
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Icon icon={User} size={32} className="text-primary" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Pattern - matching dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Futuristic cityscape effect */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-l from-teal-500/10 to-transparent rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <Icon icon={ArrowLeft} size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profil</h1>
              <p className="text-muted-foreground text-sm">Gérez votre compte et vos paramètres</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="rounded-full text-destructive hover:text-destructive"
          >
            <Icon icon={LogOut} size={20} />
          </Button>
        </div>

        {/* Profile Card */}
        <Card variant="banking" className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-background border-2 border-background rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                  <Icon icon={Camera} size={14} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-card-foreground truncate">
                  {user.name || 'Utilisateur'}
                </h2>
                <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" size="sm">
                    Membre depuis 2024
                  </Badge>
                  <Badge variant="success" size="sm">
                    Vérifié
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-full"
              >
                <Icon icon={isEditing ? X : Edit} size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-xl p-1">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'security', label: 'Sécurité', icon: Shield },
            { id: 'preferences', label: 'Préférences', icon: Settings }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <TabIcon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Icon icon={User} size={20} />
                  <span>Informations personnelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nom complet</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom complet"
                    disabled={!isEditing}
                    variant="banking"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Icon icon={Mail} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                      disabled={!isEditing}
                      className="pl-12"
                      variant="banking"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Téléphone</label>
                  <div className="relative">
                    <Icon icon={Phone} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                      disabled={!isEditing}
                      className="pl-12"
                      variant="banking"
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      <Icon icon={Check} size={16} className="mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      <Icon icon={X} size={16} className="mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Icon icon={Shield} size={20} />
                  <span>Sécurité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Changer le mot de passe</h4>
                  <div className="space-y-3">
                    <div className="relative">
                      <Icon icon={Lock} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Mot de passe actuel"
                        className="pl-12"
                        variant="banking"
                      />
                    </div>
                    <div className="relative">
                      <Icon icon={Lock} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        className="pl-12"
                        variant="banking"
                      />
                    </div>
                    <div className="relative">
                      <Icon icon={Lock} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Confirmer le nouveau mot de passe"
                        className="pl-12"
                        variant="banking"
                      />
                    </div>
                  </div>
                  <Button className="w-full">
                    <Icon icon={Shield} size={16} className="mr-2" />
                    Changer le mot de passe
                  </Button>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon icon={Smartphone} size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Authentification biométrique</p>
                        <p className="text-xs text-muted-foreground">Empreinte ou Face ID</p>
                      </div>
                    </div>
                    <Button
                      variant={formData.biometricAuth ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, biometricAuth: !formData.biometricAuth })}
                    >
                      {formData.biometricAuth ? 'Activé' : 'Désactivé'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Icon icon={Settings} size={20} />
                  <span>Préférences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon icon={Bell} size={20} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Notifications push</p>
                          <p className="text-xs text-muted-foreground">Recevoir des notifications</p>
                        </div>
                      </div>
                      <Button
                        variant={formData.notifications ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
                      >
                        {formData.notifications ? 'Activé' : 'Désactivé'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Langue</h4>
                    <div className="relative">
                      <Icon icon={Globe} size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Affichage</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon icon={showBalance ? Eye : EyeOff} size={20} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Afficher les soldes</p>
                          <p className="text-xs text-muted-foreground">Masquer/afficher les montants</p>
                        </div>
                      </div>
                      <Button
                        variant={showBalance ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? 'Visible' : 'Masqué'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full"
          size="lg"
          onClick={handleLogout}
        >
          <Icon icon={LogOut} size={16} className="mr-2" />
          Se déconnecter
        </Button>

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
}