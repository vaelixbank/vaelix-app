'use client';

import { useState, useEffect, useCallback } from 'react';
import { Widget, WidgetConfig, DEFAULT_WIDGETS } from './widgetTypes';

const WIDGET_CONFIG_KEY = 'vaelix-dashboard-widgets';

export function useWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load widgets from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WIDGET_CONFIG_KEY);
      if (saved) {
        const config: WidgetConfig = JSON.parse(saved);
        setWidgets(config.widgets);
      }
    } catch (error) {
      console.error('Failed to load widget configuration:', error);
    }
  }, []);

  // Save widgets to localStorage whenever they change
  useEffect(() => {
    try {
      const config: WidgetConfig = {
        widgets,
        layout: 'grid'
      };
      localStorage.setItem(WIDGET_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save widget configuration:', error);
    }
  }, [widgets]);

  const updateWidgetPosition = useCallback((widgetId: string, newPosition: number) => {
    setWidgets(prevWidgets => {
      const updatedWidgets = prevWidgets.map(widget => {
        if (widget.id === widgetId) {
          return { ...widget, position: newPosition };
        }
        // Adjust positions of other widgets
        if (widget.position >= newPosition && widget.id !== widgetId) {
          return { ...widget, position: widget.position + 1 };
        }
        return widget;
      });

      // Sort by position
      return updatedWidgets.sort((a, b) => a.position - b.position);
    });
  }, []);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets(prevWidgets =>
      prevWidgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, isVisible: !widget.isVisible }
          : widget
      )
    );
  }, []);

  const addWidget = useCallback((type: Widget['type'], title: string) => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      title,
      position: widgets.length,
      isVisible: true
    };

    setWidgets(prevWidgets => [...prevWidgets, newWidget]);
  }, [widgets.length]);

  const removeWidget = useCallback((widgetId: string) => {
    setWidgets(prevWidgets => {
      const filtered = prevWidgets.filter(w => w.id !== widgetId);
      // Reorder positions
      return filtered.map((widget, index) => ({
        ...widget,
        position: index
      }));
    });
  }, []);

  const updateWidgetConfig = useCallback((widgetId: string, config: Record<string, unknown>) => {
    setWidgets(prevWidgets =>
      prevWidgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, config: { ...widget.config, ...config } }
          : widget
      )
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
  }, []);

  const visibleWidgets = widgets
    .filter(widget => widget.isVisible)
    .sort((a, b) => a.position - b.position);

  return {
    widgets,
    visibleWidgets,
    isEditMode,
    setIsEditMode,
    updateWidgetPosition,
    toggleWidgetVisibility,
    addWidget,
    removeWidget,
    updateWidgetConfig,
    resetToDefault
  };
}