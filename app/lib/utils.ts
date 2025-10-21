import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Platform detection utilities
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web'

  const userAgent = navigator.userAgent.toLowerCase()

  // iOS detection
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  }

  // Android detection
  if (/android/.test(userAgent)) {
    return 'android'
  }

  return 'web'
}

export function isIOS(): boolean {
  return getPlatform() === 'ios'
}

export function isAndroid(): boolean {
  return getPlatform() === 'android'
}

export function isMobile(): boolean {
  return isIOS() || isAndroid()
}

// Capacitor detection
export function isCapacitorApp(): boolean {
  return typeof window !== 'undefined' && !!(window as { Capacitor?: unknown }).Capacitor
}

// Format balance with k/M suffixes for large amounts
export function formatBalance(amount: number): string {
  if (amount < 1000) {
    return amount.toFixed(2).replace('.', ',');
  } else if (amount < 1000000) {
    const kValue = amount / 1000;
    return `${kValue.toFixed(1).replace('.', ',')}k`;
  } else {
    const mValue = amount / 1000000;
    return `${mValue.toFixed(3).replace('.', ',')}M`;
  }
}