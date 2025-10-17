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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your profile and settings</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile Card */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                <span className="text-lg text-primary-foreground font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-card-foreground">{user.name || 'User'}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">Member since 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="space-y-3">
          {/* Profile Section */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground mb-3">Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Full name</label>
                  <Input
                    type="text"
                    defaultValue={user.name || ''}
                    placeholder="Your name"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <Input
                    type="email"
                    defaultValue={user.email}
                    placeholder="your@email.com"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
                  <Input
                    type="tel"
                    placeholder="+33 6 XX XX XX XX"
                    className="text-sm"
                  />
                </div>
                <Button className="w-full" size="sm">
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground mb-3">Security</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-card-foreground mb-2">Change password</h4>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Current password"
                      className="text-sm"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      className="text-sm"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="text-sm"
                    />
                  </div>
                  <Button className="w-full mt-2" size="sm">
                    Change password
                  </Button>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-card-foreground">Biometric authentication</p>
                      <p className="text-xs text-muted-foreground">Use fingerprint or Face ID</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Enabled
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <h3 className="font-medium text-card-foreground mb-3">Settings</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-card-foreground mb-2">Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-card-foreground">Push notifications</span>
                      <Button variant="outline" size="sm">On</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-card-foreground">Security alerts</span>
                      <Button variant="outline" size="sm">On</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-card-foreground">Marketing updates</span>
                      <Button variant="outline" size="sm">Off</Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <h4 className="text-sm font-medium text-card-foreground mb-2">Language</h4>
                  <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}