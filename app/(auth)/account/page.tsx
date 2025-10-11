'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../lib/store';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function Account() {
  const user = useStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="p-2 -m-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Mon compte</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl text-white font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'Utilisateur'}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Membre depuis 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'profile', label: 'Profil', icon: '👤' },
              { id: 'security', label: 'Sécurité', icon: '🔒' },
              { id: 'settings', label: 'Paramètres', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span className="text-lg mb-1 block">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <CardContent>
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                  <Input
                    type="text"
                    defaultValue={user.name || ''}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    defaultValue={user.email}
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <Input
                    type="tel"
                    placeholder="+33 6 XX XX XX XX"
                  />
                </div>
                <Button className="w-full" size="lg">
                  Sauvegarder les modifications
                </Button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Changer le mot de passe</h3>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Mot de passe actuel"
                    />
                    <Input
                      type="password"
                      placeholder="Nouveau mot de passe"
                    />
                    <Input
                      type="password"
                      placeholder="Confirmer le nouveau mot de passe"
                    />
                  </div>
                  <Button className="w-full mt-3" size="lg">
                    Changer le mot de passe
                  </Button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Authentification biométrique</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Utiliser l&apos;empreinte digitale ou Face ID</p>
                    </div>
                    <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Activé
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Notifications push</span>
                      <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Alertes de sécurité</span>
                      <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Mises à jour marketing</span>
                      <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Langue</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
          size="lg"
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}