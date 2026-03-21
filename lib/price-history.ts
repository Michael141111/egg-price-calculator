import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PriceRecord {
  date: string; // ISO date string
  timestamp: number; // Unix timestamp
  prices: {
    red: number;
    white: number;
    local: number;
  };
}

export interface PriceStats {
  highest: number;
  lowest: number;
  average: number;
  count: number;
}

const PRICE_HISTORY_KEY = 'egg_price_history';
const MAX_HISTORY_RECORDS = 365 * 2; // Keep 2 years of data

/**
 * Save current prices to history
 */
export async function savePriceToHistory(prices: { red: number; white: number; local: number }): Promise<void> {
  try {
    const history = await getPriceHistory();
    const today = new Date().toISOString().split('T')[0];

    // Check if we already have a record for today
    const existingIndex = history.findIndex(record => record.date === today);

    const newRecord: PriceRecord = {
      date: today,
      timestamp: Date.now(),
      prices,
    };

    if (existingIndex >= 0) {
      // Update today's record
      history[existingIndex] = newRecord;
    } else {
      // Add new record
      history.push(newRecord);
    }

    // Keep only the most recent records
    if (history.length > MAX_HISTORY_RECORDS) {
      history.splice(0, history.length - MAX_HISTORY_RECORDS);
    }

    await AsyncStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save price to history:', error);
  }
}

/**
 * Get all price history records
 */
export async function getPriceHistory(): Promise<PriceRecord[]> {
  try {
    const data = await AsyncStorage.getItem(PRICE_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get price history:', error);
    return [];
  }
}

/**
 * Get price records for a specific time period
 */
export async function getPricesByPeriod(
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Promise<PriceRecord[]> {
  const history = await getPriceHistory();
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'daily':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'yearly':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }

  return history.filter(record => new Date(record.date) >= startDate);
}

/**
 * Calculate statistics for a specific egg type
 */
export async function calculateStats(
  eggType: 'red' | 'white' | 'local',
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Promise<PriceStats> {
  const records = await getPricesByPeriod(period);

  if (records.length === 0) {
    return {
      highest: 0,
      lowest: 0,
      average: 0,
      count: 0,
    };
  }

  const prices = records.map(record => record.prices[eggType]);
  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;

  return {
    highest,
    lowest,
    average,
    count: prices.length,
  };
}

/**
 * Clear all price history
 */
export async function clearPriceHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PRICE_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear price history:', error);
  }
}

/**
 * Export price history as JSON
 */
export async function exportPriceHistory(): Promise<string> {
  const history = await getPriceHistory();
  return JSON.stringify(history, null, 2);
}

/**
 * Import price history from JSON
 */
export async function importPriceHistory(jsonData: string): Promise<void> {
  try {
    const history = JSON.parse(jsonData);
    if (Array.isArray(history)) {
      await AsyncStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Failed to import price history:', error);
    throw new Error('Invalid price history format');
  }
}
