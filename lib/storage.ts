import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Prices, ThemeMode } from './types';

const STORAGE_KEYS = {
  PRICES: '@egg_calculator_prices',
  CURRENCY: '@egg_calculator_currency',
  THEME: '@egg_calculator_theme',
  DEFAULT_PRICES: '@egg_calculator_default_prices',
};

const DEFAULT_PRICES: Prices = {
  red: 90,
  white: 99,
  local: 150,
};

const DEFAULT_CURRENCY = 'جنيه مصري';
const DEFAULT_THEME: ThemeMode = 'system';

/**
 * Load all app settings from storage
 */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const [pricesJson, currency, theme] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.PRICES),
      AsyncStorage.getItem(STORAGE_KEYS.CURRENCY),
      AsyncStorage.getItem(STORAGE_KEYS.THEME),
    ]);

    return {
      prices: pricesJson ? JSON.parse(pricesJson) : DEFAULT_PRICES,
      currencyName: currency || DEFAULT_CURRENCY,
      themeMode: (theme as ThemeMode) || DEFAULT_THEME,
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      prices: DEFAULT_PRICES,
      currencyName: DEFAULT_CURRENCY,
      themeMode: DEFAULT_THEME,
    };
  }
}

/**
 * Load custom default prices from storage
 */
export async function loadCustomDefaults(): Promise<Prices> {
  try {
    const customDefaultsJson = await AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_PRICES);
    return customDefaultsJson ? JSON.parse(customDefaultsJson) : DEFAULT_PRICES;
  } catch (error) {
    console.error('Error loading custom defaults:', error);
    return DEFAULT_PRICES;
  }
}

/**
 * Save custom default prices to storage
 */
export async function saveCustomDefaults(prices: Prices): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_PRICES, JSON.stringify(prices));
  } catch (error) {
    console.error('Error saving custom defaults:', error);
  }
}

/**
 * Save prices to storage
 */
export async function savePrices(prices: Prices): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(prices));
  } catch (error) {
    console.error('Error saving prices:', error);
  }
}

/**
 * Save currency name to storage
 */
export async function saveCurrency(currencyName: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, currencyName);
  } catch (error) {
    console.error('Error saving currency:', error);
  }
}

/**
 * Save theme preference to storage
 */
export async function saveTheme(theme: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
}

/**
 * Get default prices (hardcoded system defaults)
 */
export function getDefaultPrices(): Prices {
  return { ...DEFAULT_PRICES };
}

/**
 * Get default currency
 */
export function getDefaultCurrency(): string {
  return DEFAULT_CURRENCY;
}

/**
 * Get default theme
 */
export function getDefaultTheme(): ThemeMode {
  return DEFAULT_THEME;
}

/**
 * Get system default prices (90/99/150)
 */
export function getSystemDefaultPrices(): Prices {
  return {
    red: 90,
    white: 99,
    local: 150,
  };
}
