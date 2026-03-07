/**
 * Egg product types
 */
export type EggType = 'red' | 'white' | 'local';

/**
 * Theme options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Prices for each egg type (carton price in currency units)
 */
export interface Prices {
  red: number;
  white: number;
  local: number;
}

/**
 * App settings stored in AsyncStorage
 */
export interface AppSettings {
  prices: Prices;
  currencyName: string;
  themeMode: ThemeMode;
}

/**
 * Calculation mode: 'byCount' = input egg count, 'byAmount' = input amount to get egg count
 */
export type CalculationMode = 'byCount' | 'byAmount';

/**
 * Calculator state
 */
export interface CalculatorState {
  selectedEgg: EggType | null;
  eggCount: string;
  amountPaid: string;
  activeField: 'eggCount' | 'amountPaid' | null;
  calculationMode: CalculationMode;
}

/**
 * Calculated values
 */
export interface CalculatedValues {
  cartonPrice: number;
  eggPrice: number;
  total: number;
  change: number;
}
