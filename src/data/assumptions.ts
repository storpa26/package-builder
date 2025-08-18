export type Context = 'residential' | 'retail';

export interface ContextAssumptions {
  basePrice: Record<Context, number>;
  includedRunMeters: Record<Context, number>;
  powerBudgetMilliAmps: number;
  inputLimit: number;
  onboardInputs: number;
  touchscreenThreshold: number;
  maxKeypads: number;
}

export const assumptions: ContextAssumptions = {
  basePrice: { 
    residential: 1295, 
    retail: 1495
  },
  includedRunMeters: { 
    residential: 20, 
    retail: 25
  },
  powerBudgetMilliAmps: 1000,
  inputLimit: 32,
  onboardInputs: 8,
  touchscreenThreshold: 2,
  maxKeypads: 8
};

export const contextLabels: Record<Context, string> = {
  residential: 'Residential',
  retail: 'Small Retail'
};

export const defaultChips: Record<Context, string[]> = {
  residential: ['≤200 m²', 'Single storey', 'Avg run 15–20 m'],
  retail: ['≤300 m²', 'Ground floor', 'Avg run 20–25 m']
};