import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { CalculatorState, Prices, AppSettings } from './types';
import { loadSettings, savePrices, saveCurrency } from './storage';

interface CalculatorContextType {
  state: CalculatorState;
  settings: AppSettings;
  selectEgg: (eggType: 'red' | 'white' | 'local') => void;
  addDigit: (digit: string) => void;
  clearField: () => void;
  clearAll: () => void;
  setActiveField: (field: 'eggCount' | 'amountPaid' | null) => void;
  toggleCalculationMode: () => void;
  updatePrices: (prices: Prices) => Promise<void>;
  updateCurrency: (currency: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

const initialState: CalculatorState = {
  selectedEgg: null,
  eggCount: '',
  amountPaid: '',
  activeField: null,
  calculationMode: 'byCount',
};

type CalculatorAction =
  | { type: 'SELECT_EGG'; payload: 'red' | 'white' | 'local' }
  | { type: 'ADD_DIGIT'; payload: string }
  | { type: 'CLEAR_FIELD' }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_ACTIVE_FIELD'; payload: 'eggCount' | 'amountPaid' | null }
  | { type: 'TOGGLE_CALCULATION_MODE' };

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SELECT_EGG':
      return {
        ...state,
        selectedEgg: action.payload,
        eggCount: '',
        amountPaid: '',
        activeField: null,
      };

    case 'ADD_DIGIT':
      if (state.activeField === 'eggCount') {
        return {
          ...state,
          eggCount: state.eggCount + action.payload,
        };
      } else if (state.activeField === 'amountPaid') {
        return {
          ...state,
          amountPaid: state.amountPaid + action.payload,
        };
      }
      return state;

    case 'CLEAR_FIELD':
      if (state.activeField === 'eggCount') {
        return { ...state, eggCount: '' };
      } else if (state.activeField === 'amountPaid') {
        return { ...state, amountPaid: '' };
      }
      return state;

    case 'CLEAR_ALL':
      return {
        ...state,
        eggCount: '',
        amountPaid: '',
        activeField: null,
      };

    case 'SET_ACTIVE_FIELD':
      return {
        ...state,
        activeField: action.payload,
      };

    case 'TOGGLE_CALCULATION_MODE':
      return {
        ...state,
        calculationMode: state.calculationMode === 'byCount' ? 'byAmount' : 'byCount',
        eggCount: '',
        amountPaid: '',
        activeField: null,
      };

    default:
      return state;
  }
}

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const [settings, setSettings] = useState<AppSettings>({
    prices: { red: 90, white: 99, local: 150 },
    currencyName: 'جنيه مصري',
    themeMode: 'system',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const initSettings = async () => {
      try {
        const loadedSettings = await loadSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSettings();
  }, []);

  const selectEgg = (eggType: 'red' | 'white' | 'local') => {
    dispatch({ type: 'SELECT_EGG', payload: eggType });
  };

  const addDigit = (digit: string) => {
    dispatch({ type: 'ADD_DIGIT', payload: digit });
  };

  const clearField = () => {
    dispatch({ type: 'CLEAR_FIELD' });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const setActiveField = (field: 'eggCount' | 'amountPaid' | null) => {
    dispatch({ type: 'SET_ACTIVE_FIELD', payload: field });
  };

  const toggleCalculationMode = () => {
    dispatch({ type: 'TOGGLE_CALCULATION_MODE' });
  };

  const updatePrices = async (prices: Prices) => {
    setSettings((prev) => ({
      ...prev,
      prices,
    }));
    await savePrices(prices);
  };

  const updateCurrency = async (currency: string) => {
    setSettings((prev) => ({
      ...prev,
      currencyName: currency,
    }));
    await saveCurrency(currency);
  };

  const resetToDefaults = async () => {
    const defaultPrices = { red: 90, white: 99, local: 150 };
    await updatePrices(defaultPrices);
  };

  const value: CalculatorContextType = {
    state,
    settings,
    selectEgg,
    addDigit,
    clearField,
    clearAll,
    setActiveField,
    toggleCalculationMode,
    updatePrices,
    updateCurrency,
    resetToDefaults,
    isLoading,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator(): CalculatorContextType {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within CalculatorProvider');
  }
  return context;
}
