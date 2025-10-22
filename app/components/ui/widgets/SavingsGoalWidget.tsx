'use client';

import { Widget } from '../../../lib/widgetTypes';
import { Target, TrendingUp } from 'lucide-react';

interface SavingsGoalWidgetProps {
  widget: Widget;
  isEditMode: boolean;
}

export function SavingsGoalWidget({ widget, isEditMode }: SavingsGoalWidgetProps) {
  // Mock data - in real app, this would come from props or API
  const savingsGoals = [
    {
      name: 'Vacances d\'été',
      current: 2400,
      target: 3500,
      deadline: 'Août 2024',
      progress: 68.6
    },
    {
      name: 'Fonds d\'urgence',
      current: 8500,
      target: 10000,
      deadline: 'Décembre 2024',
      progress: 85
    }
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">{widget.title}</h2>
      </div>
      <div className="space-y-4">
        {savingsGoals.map((goal, index) => (
          <div key={index} className="bg-slate-800/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{goal.name}</p>
                  <p className="text-slate-400 text-sm">Échéance: {goal.deadline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{goal.current.toLocaleString()} €</p>
                <p className="text-slate-400 text-sm">sur {goal.target.toLocaleString()} €</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progression</span>
                <span className="text-white font-medium">{goal.progress}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}