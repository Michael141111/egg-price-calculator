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
 * Favorite quantities for quick price lookup
 */
export interface FavoriteQuantities {
  quantities: number[];
}

/**
 * App settings stored in AsyncStorage
 */
export interface AppSettings {
  prices: Prices;
  currencyName: string;
  themeMode: ThemeMode;
  favoriteQuantities?: FavoriteQuantities;
}

/**
 * Cart item for multi-product selection
 */
export interface CartItem {
  eggType: EggType;
  quantity: number;
  price: number;
}

/**
 * Calculator state
 */
export interface CalculatorState {
  selectedEgg: EggType | null;
  eggCount: string;
  amountPaid: string;
  activeField: 'eggCount' | 'amountPaid' | null;
  calculationMode: 'byCount' | 'byAmount';
  cart: CartItem[];
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
