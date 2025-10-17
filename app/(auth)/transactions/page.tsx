'use client';

import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function Transactions() {
  const transactions = useStore((state) => state.transactions);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Transactions</h1>
              <p className="text-muted-foreground text-sm mt-1">Your transaction history</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard'}>
              Back
            </Button>
          </div>
        </div>

        {/* Transactions List */}
          <Card className="border border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <span className={`text-xs font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.description.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-card-foreground text-sm truncate">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-semibold text-sm ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}