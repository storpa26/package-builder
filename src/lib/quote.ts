import { Context } from '@/data/assumptions';
import { SelectedAddon } from '@/lib/rules';

export interface QuotePayload {
  package: string;
  context: Context;
  answers?: Record<string, any>;
  base: number;
  addons: Array<{ id: string; name: string; qty: number; price: number }>;
  autoItems: Array<{ id: string; name: string; qty: number; price: number }>;
  estimatedTotal: number;
  timestamp: Date;
}

export function sendQuote(payload: QuotePayload): Promise<void> {
  // This is a stub function that would integrate with your actual quote system
  // Could be Make.com webhook, FluentForm, Elementor, or direct form submission
  
  console.log('Quote Request Payload:', JSON.stringify(payload, null, 2));
  
  // In a real implementation, this would be:
  // return fetch('/api/quote', { method: 'POST', body: JSON.stringify(payload) })
  // or webhook call to Make.com
  // or integration with your CRM/quote system
  
  return new Promise((resolve) => {
    setTimeout(() => {
      alert(`Quote request submitted!\nEstimated Total: $${payload.estimatedTotal.toLocaleString()}\n\nThis would normally go to your quote/CRM system.`);
      resolve();
    }, 500);
  });
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}