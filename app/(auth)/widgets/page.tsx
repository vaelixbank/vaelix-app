'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/store';
import { useWidgets } from '../../lib/useWidgets';
import { AVAILABLE_WIDGETS, Widget } from '../../lib/widgetTypes';
import { Icon } from '../../../lib/icon';
import {
  ArrowLeft,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Settings,
  CheckCircle
} from 'lucide-react';

export default function WidgetsPage() {
  const router = useRouter();
  const { isAuthenticated } = useStore();
  const { widgets, addWidget, removeWidget, toggleWidgetVisibility } = useWidgets();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleAddWidget = () => {
    if (selectedType) {
      const widgetInfo = AVAILABLE_WIDGETS.find(w => w.type === selectedType);
      if (widgetInfo) {
        addWidget(selectedType as Widget['type'], customTitle || widgetInfo.title);
        setSelectedType(null);
        setCustomTitle('');
      }
    }
  };

  const visibleWidgets = widgets.filter(w => w.isVisible);
  const hiddenWidgets = widgets.filter(w => !w.isVisible);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Pattern - matching dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Futuristic cityscape effect */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-l from-teal-500/10 to-transparent rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-semibold">Gérer les widgets</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Current Widgets - Revolut Style */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Widgets actifs</h2>
            <span className="px-3 py-1 bg-slate-800/60 border border-slate-700 text-slate-400 text-sm rounded-full">
              {visibleWidgets.length}
            </span>
          </div>
          <div className="grid gap-3">
            {visibleWidgets.map((widget) => {
              const widgetInfo = AVAILABLE_WIDGETS.find(w => w.type === widget.type);
              return (
                <div key={widget.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 hover:bg-slate-700/60 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{widgetInfo?.icon}</div>
                      <div>
                        <p className="text-white font-medium">{widget.title}</p>
                        <p className="text-slate-400 text-sm">{widgetInfo?.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleWidgetVisibility(widget.id)}
                        className="p-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 transition-colors group"
                        title="Masquer le widget"
                      >
                        <Eye className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                      </button>
                      <button
                        onClick={() => removeWidget(widget.id)}
                        className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors group"
                        title="Supprimer le widget"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hidden Widgets */}
        {hiddenWidgets.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">Widgets masqués</h2>
              <span className="px-3 py-1 bg-slate-800/60 border border-slate-700 text-slate-500 text-sm rounded-full">
                {hiddenWidgets.length}
              </span>
            </div>
            <div className="grid gap-3">
              {hiddenWidgets.map((widget) => {
                const widgetInfo = AVAILABLE_WIDGETS.find(w => w.type === widget.type);
                return (
                  <div key={widget.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 opacity-60 hover:opacity-80 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl opacity-50">{widgetInfo?.icon}</div>
                        <div>
                          <p className="text-slate-400 font-medium">{widget.title}</p>
                          <p className="text-slate-500 text-sm">{widgetInfo?.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleWidgetVisibility(widget.id)}
                          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors group"
                          title="Afficher le widget"
                        >
                          <EyeOff className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
                        </button>
                        <button
                          onClick={() => removeWidget(widget.id)}
                          className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors group"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Add New Widget - Revolut Style */}
        <section>
          <h2 className="text-white text-lg font-semibold mb-4">Ajouter un widget</h2>

          {/* Widget Categories */}
          {['Analytics', 'Comptes', 'Budget', 'Transactions', 'Investissement', 'Activité'].map((category) => {
            const categoryWidgets = AVAILABLE_WIDGETS.filter(w => w.category === category);
            if (categoryWidgets.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h3 className="text-slate-300 text-sm font-medium mb-3 uppercase tracking-wide">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryWidgets.map((widgetType) => (
                    <button
                      key={widgetType.type}
                      onClick={() => setSelectedType(widgetType.type)}
                      className={`p-4 rounded-2xl border transition-all duration-200 text-left ${
                        selectedType === widgetType.type
                          ? 'border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-500/10'
                          : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{widgetType.icon}</div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium mb-1">{widgetType.title}</p>
                          <p className="text-slate-400 text-xs leading-relaxed">{widgetType.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Custom Title Input */}
          {selectedType && (
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">
                  {AVAILABLE_WIDGETS.find(w => w.type === selectedType)?.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {AVAILABLE_WIDGETS.find(w => w.type === selectedType)?.title}
                  </h3>
                  <p className="text-slate-400 text-sm">Prêt à être ajouté à votre dashboard</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Titre personnalisé (optionnel)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={AVAILABLE_WIDGETS.find(w => w.type === selectedType)?.title}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedType(null)}
                  className="flex-1 px-4 py-3 bg-slate-700/60 hover:bg-slate-600/60 text-slate-300 hover:text-white rounded-xl font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddWidget}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Instructions */}
        <section className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4">
          <h3 className="text-white font-medium mb-2">Comment ça marche ?</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>• Retournez au dashboard et cliquez sur &quot;Modifier&quot;</li>
            <li>• Glissez-déposez les widgets pour les réorganiser</li>
            <li>• Utilisez l&apos;œil pour masquer/afficher les widgets</li>
            <li>• La corbeille supprime d&eacute;finitivement un widget</li>
          </ul>
        </section>
      </div>
    </div>
  );
}