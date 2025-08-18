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
  
  // In a real implementation, this would be:
  // return fetch('/api/quote', { method: 'POST', body: JSON.stringify(payload) })
  // or webhook call to Make.com
  // or integration with your CRM/quote system
  
  return Promise.resolve();
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}