'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Icon } from '../../../lib/icon';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your spending and financial insights</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">This month</p>
                  <p className="text-lg font-bold text-foreground">-€1,250</p>
                </div>
                <Icon icon={TrendingDown} size={20} className="text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Income</p>
                  <p className="text-lg font-bold text-foreground">+€3,200</p>
                </div>
                <Icon icon={TrendingUp} size={20} className="text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Savings</p>
                  <p className="text-lg font-bold text-foreground">€1,950</p>
                </div>
                <Icon icon={DollarSign} size={20} className="text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Categories</p>
                  <p className="text-lg font-bold text-foreground">12</p>
                </div>
                <Icon icon={PieChart} size={20} className="text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Food & Dining</span>
                </div>
                <span className="font-semibold text-sm">€450</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Transportation</span>
                </div>
                <span className="font-semibold text-sm">€320</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Entertainment</span>
                </div>
                <span className="font-semibold text-sm">€180</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}