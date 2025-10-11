import { WalletCard } from './store';

export interface CardDetails {
  id: string;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
}

export class WalletService {
  // Mock Apple Pay integration
  static async addToApplePay(cardDetails: CardDetails): Promise<WalletCard> {
    // Simulate API call to Apple Pay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure randomly
        const success = Math.random() > 0.2; // 80% success rate

        if (success) {
          const walletCard: WalletCard = {
            id: `apple_${Date.now()}`,
            cardId: cardDetails.id,
            walletType: 'apple_pay',
            status: 'active',
            addedAt: new Date().toISOString()
          };
          resolve(walletCard);
        } else {
          reject(new Error('Failed to add card to Apple Pay. Please try again.'));
        }
      }, 2000); // Simulate network delay
    });
  }

  // Mock Google Pay integration
  static async addToGooglePay(cardDetails: CardDetails): Promise<WalletCard> {
    // Simulate API call to Google Pay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure randomly
        const success = Math.random() > 0.2; // 80% success rate

        if (success) {
          const walletCard: WalletCard = {
            id: `google_${Date.now()}`,
            cardId: cardDetails.id,
            walletType: 'google_pay',
            status: 'active',
            addedAt: new Date().toISOString()
          };
          resolve(walletCard);
        } else {
          reject(new Error('Failed to add card to Google Pay. Please try again.'));
        }
      }, 2000); // Simulate network delay
    });
  }

  // Check if device supports Apple Pay
  static isApplePaySupported(): boolean {
    return typeof window !== 'undefined' &&
           'ApplePaySession' in window &&
           (window as { ApplePaySession?: { canMakePayments(): boolean } }).ApplePaySession?.canMakePayments() === true;
  }

  // Check if device supports Google Pay
  static isGooglePaySupported(): boolean {
    // Google Pay is supported on Android and some iOS devices
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return isAndroid || isIOS;
  }

  // Validate card details
  static validateCard(cardDetails: CardDetails): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!cardDetails.name || cardDetails.name.trim().length < 2) {
      errors.push('Cardholder name is required');
    }

    if (!cardDetails.number || !/^\d{13,19}$/.test(cardDetails.number.replace(/\s/g, ''))) {
      errors.push('Invalid card number');
    }

    if (!cardDetails.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
      errors.push('Invalid expiry date (MM/YY)');
    }

    if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
      errors.push('Invalid CVV');
    }

    // Check expiry date is not in the past
    if (cardDetails.expiry) {
      const [month, year] = cardDetails.expiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expiryDate < now) {
        errors.push('Card has expired');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Tokenize card (mock implementation)
  static async tokenizeCard(): Promise<string> {
    // In a real implementation, this would call a payment processor
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a mock token
        const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        resolve(token);
      }, 1000);
    });
  }
}