export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: number;
  isVisible: boolean;
  config?: Record<string, unknown>;
}

export type WidgetType =
  | 'transactions'
  | 'quick-stats'
  | 'spending-breakdown'
  | 'watchlist'
  | 'accounts'
  | 'monthly-spending'
  | 'savings-goal'
  | 'recent-activity';

export interface WidgetConfig {
  widgets: Widget[];
  layout: 'grid' | 'list';
}

export const DEFAULT_WIDGETS: Widget[] = [
  {
    id: 'transactions',
    type: 'transactions',
    title: 'Dernières transactions',
    position: 0,
    isVisible: true,
    config: { maxItems: 5 }
  },
  {
    id: 'quick-stats',
    type: 'quick-stats',
    title: 'Statistiques rapides',
    position: 1,
    isVisible: true
  },
  {
    id: 'spending-breakdown',
    type: 'spending-breakdown',
    title: 'Répartition des dépenses',
    position: 2,
    isVisible: true
  },
  {
    id: 'accounts',
    type: 'accounts',
    title: 'Comptes',
    position: 3,
    isVisible: true
  },
  {
    id: 'monthly-spending',
    type: 'monthly-spending',
    title: 'Dépensés ce mois-ci',
    position: 4,
    isVisible: true
  },
  {
    id: 'savings-goal',
    type: 'savings-goal',
    title: 'Objectifs d\'épargne',
    position: 5,
    isVisible: false
  },
  {
    id: 'watchlist',
    type: 'watchlist',
    title: 'Liste de surveillance',
    position: 6,
    isVisible: false
  }
];

export const AVAILABLE_WIDGETS: { type: WidgetType; title: string; description: string; icon: string; category: string }[] = [
  {
    type: 'transactions',
    title: 'Dernières transactions',
    description: 'Affiche vos dernières transactions',
    icon: '💳',
    category: 'Transactions'
  },
  {
    type: 'quick-stats',
    title: 'Statistiques rapides',
    description: 'Métriques financières clés avec tendances',
    icon: '📊',
    category: 'Analytics'
  },
  {
    type: 'spending-breakdown',
    title: 'Répartition des dépenses',
    description: 'Dépenses par catégorie avec graphiques',
    icon: '📈',
    category: 'Analytics'
  },
  {
    type: 'watchlist',
    title: 'Liste de surveillance',
    description: 'Suivi des cryptomonnaies et actifs',
    icon: '📱',
    category: 'Investissement'
  },
  {
    type: 'accounts',
    title: 'Comptes',
    description: 'Vue d\'ensemble de vos comptes',
    icon: '🏦',
    category: 'Comptes'
  },
  {
    type: 'monthly-spending',
    title: 'Dépensés ce mois-ci',
    description: 'Suivi des dépenses mensuelles',
    icon: '💰',
    category: 'Budget'
  },
  {
    type: 'savings-goal',
    title: 'Objectif d\'épargne',
    description: 'Progression vers vos objectifs d\'épargne',
    icon: '🎯',
    category: 'Budget'
  },
  {
    type: 'recent-activity',
    title: 'Activité récente',
    description: 'Résumé de vos activités bancaires',
    icon: '⚡',
    category: 'Activité'
  }
];