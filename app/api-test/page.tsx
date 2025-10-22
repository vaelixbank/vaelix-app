'use client';

import { useState } from 'react';

import { Button } from '../components/ui/button';

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      const result = await response.json();
      setResults(prev => ({ ...prev, login: result }));
    } catch (err) {
      setResults(prev => ({ ...prev, login: `Error: ${err}` }));
    }
  };

  const testHealth = async () => {
    try {
      const response = await fetch('http://localhost:8080/health');
      const result = await response.text();
      setResults(prev => ({ ...prev, health: result }));
    } catch (err) {
      setResults(prev => ({ ...prev, health: `Error: ${err}` }));
    }
  };

  const testCreateUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/consumers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          name: 'New User',
          user_type: 'consumer'
        })
      });
      const result = await response.json();
      setResults(prev => ({ ...prev, createUser: result }));
    } catch (err) {
      setResults(prev => ({ ...prev, createUser: `Error: ${err}` }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">API Test Page</h1>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Check */}
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Health Check</h2>
            <Button
              onClick={testHealth}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing...' : 'Test Health'}
            </Button>
            {results.health && (
              <div className="mt-4 p-3 bg-slate-700 rounded text-green-400 font-mono text-sm">
                {results.health}
              </div>
            )}
          </div>

          {/* Login Test */}
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Login Test</h2>
            <Button
              onClick={testLogin}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing...' : 'Test Login'}
            </Button>
            {results.login && (
              <div className="mt-4 p-3 bg-slate-700 rounded text-green-400 font-mono text-sm overflow-auto">
                <pre>{JSON.stringify(results.login, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Create User Test */}
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Create User Test</h2>
            <Button
              onClick={testCreateUser}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing...' : 'Test Create User'}
            </Button>
            {results.createUser && (
              <div className="mt-4 p-3 bg-slate-700 rounded text-green-400 font-mono text-sm overflow-auto">
                <pre>{JSON.stringify(results.createUser, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* API Status */}
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">API Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Backend URL:</span>
                <span className="text-white">http://localhost:8080</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-green-400">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Features:</span>
                <span className="text-blue-400">Auth, Accounts, Cards, Transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-800/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          <div className="text-slate-300 space-y-2">
            <p>1. <strong>Démarrer le backend Rust:</strong> <code className="bg-slate-700 px-2 py-1 rounded text-sm">cd api && cargo run</code></p>
            <p>2. <strong>Tester les endpoints:</strong> Cliquez sur les boutons ci-dessus pour tester l'API</p>
            <p>3. <strong>Dashboard avec API:</strong> Allez sur /dashboard et cliquez sur l'icône refresh (🔄) pour basculer vers l'API</p>
            <p>4. <strong>Données mockées:</strong> L'icône sera grise pour les données mockées, verte pour l'API</p>
          </div>
        </div>
      </div>
    </div>
  );
}