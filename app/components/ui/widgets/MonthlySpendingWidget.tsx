'use client';

import { Widget } from '../../../lib/widgetTypes';

interface MonthlySpendingWidgetProps {
  widget: Widget;
  isEditMode: boolean;
  monthlyExpenses: number;
  monthProgressPercent: number;
  lastDayOfMonth: number;
  dayOfMonth: number;
}

export function MonthlySpendingWidget({
  widget,
  isEditMode,
  monthlyExpenses,
  monthProgressPercent,
  lastDayOfMonth,
  dayOfMonth
}: MonthlySpendingWidgetProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-slate-300 text-sm">{widget.title}</h2>
        <span className="text-slate-300 text-sm">0 €</span>
      </div>
      <div className="text-white text-5xl font-bold mb-6">{monthlyExpenses.toFixed(0)} €</div>
      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-white" style={{ width: `${monthProgressPercent}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-slate-400 text-xs">
        <span>1</span>
        <span>6</span>
        <span>11</span>
        <span>16</span>
        <span>21</span>
        <span>26</span>
        <span>{lastDayOfMonth}</span>
      </div>
    </div>
  );
}