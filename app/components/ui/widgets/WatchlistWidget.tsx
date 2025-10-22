'use client';

import { Widget } from '../../../lib/widgetTypes';

interface WatchlistWidgetProps {
  widget: Widget;
  isEditMode: boolean;
}

export function WatchlistWidget({ widget, isEditMode }: WatchlistWidgetProps) {
  const watchlistItems = [
    { name: 'DogeCoin', symbol: 'DOGE', pair: 'DOGE à EUR', price: '0,17 €', change: '+ 2,19 %', color: 'bg-yellow-400' },
    { name: 'Bitcoin', symbol: 'BTC', pair: 'BTC à EUR', price: '95 361 €', change: '+ 1,79 %', color: 'bg-orange-500' }
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold">{widget.title}</h2>
        {!isEditMode && <span className="text-slate-400 text-sm">›</span>}
      </div>
      <div className="space-y-4">
        {watchlistItems.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center text-white font-bold`}>
                {item.symbol[0]}
              </div>
              <div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-slate-400 text-sm">{item.pair}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{item.price}</p>
              <p className="text-green-400 text-sm">{item.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}