'use client';

import { Widget } from '../../../lib/widgetTypes';

interface AccountsWidgetProps {
  widget: Widget;
  isEditMode: boolean;
  accounts: Array<{
    id: string;
    name: string;
    iban?: string;
  }>;
}

export function AccountsWidget({ widget, isEditMode, accounts }: AccountsWidgetProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold">{widget.title}</h2>
        {!isEditMode && <span className="text-slate-400 text-sm">›</span>}
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {accounts.slice(0, 3).map((account) => (
          <div key={account.id} className="min-w-[180px] h-28 rounded-xl p-4 bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-6 w-10 rounded bg-white/20" />
              <div className="h-6 w-10 rounded bg-white/20" />
            </div>
            <div>
              <p className="text-slate-300 text-xs mb-1">{account.name}</p>
              <p className="text-white font-semibold tracking-wider">•••• {account.iban ? account.iban.slice(-4) : '0000'}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center space-x-1">
        <span className="w-2 h-2 rounded-full bg-white" />
        <span className="w-2 h-2 rounded-full bg-slate-500" />
      </div>
    </div>
  );
}