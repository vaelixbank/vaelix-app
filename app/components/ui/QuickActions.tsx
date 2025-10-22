'use client';

import { Plus, ArrowUpDown, Building2, MoreHorizontal } from 'lucide-react';
import { Icon } from '../../../lib/icon';

export function QuickActions() {
  return (
    <>
      {/* Carousel Indicators - 3 dots */}
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
      </div>

      {/* Quick Actions - 4 circular buttons */}
      <div className="flex justify-center space-x-8 py-4" role="toolbar" aria-label="Actions rapides">
        <div className="flex flex-col items-center space-y-2">
          <button
            className="w-14 h-14 bg-slate-800/50 hover:bg-slate-700/50 hover:scale-110 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Ajouter de l'argent"
          >
            <Icon icon={Plus} size={24} className="text-white" />
          </button>
          <span className="text-xs text-slate-400 text-center">Ajouter de l&apos;argent</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <button
            className="w-14 h-14 bg-slate-800/50 hover:bg-slate-700/50 hover:scale-110 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Transférer de l'argent"
          >
            <Icon icon={ArrowUpDown} size={24} className="text-white" />
          </button>
          <span className="text-xs text-slate-400 text-center">Transférer</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <button
            className="w-14 h-14 bg-slate-800/50 hover:bg-slate-700/50 hover:scale-110 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Voir les informations"
          >
            <Icon icon={Building2} size={24} className="text-white" />
          </button>
          <span className="text-xs text-slate-400 text-center">Informations</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <button
            className="w-14 h-14 bg-slate-800/50 hover:bg-slate-700/50 hover:scale-110 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Voir plus d'options"
          >
            <Icon icon={MoreHorizontal} size={24} className="text-white" />
          </button>
          <span className="text-xs text-slate-400 text-center">Plus</span>
        </div>
      </div>
    </>
  );
}