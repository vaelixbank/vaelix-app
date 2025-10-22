'use client';

import { Widget } from '../../../lib/widgetTypes';
import { TrendingUp, TrendingDown, PiggyBank, Target } from 'lucide-react';

interface QuickStatsWidgetProps {
  widget: Widget;
  isEditMode: boolean;
  quickStats: Array<{
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

export function QuickStatsWidget({ widget, isEditMode, quickStats }: QuickStatsWidgetProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">{widget.title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-slate-400" />
              <div className={`flex items-center space-x-1 text-xs ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className="w-3 h-3" />
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
            <p className="text-white font-bold text-lg">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}