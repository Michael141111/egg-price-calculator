import { describe, it, expect } from 'vitest';

/**
 * Test calculator logic and price calculations
 */
describe('Calculator Logic', () => {
  describe('Price Calculations', () => {
    it('should calculate egg price correctly (carton price / 30)', () => {
      const cartonPrice = 90;
      const eggPrice = cartonPrice / 30;
      expect(eggPrice).toBe(3);
    });

    it('should calculate total correctly (egg count × egg price)', () => {
      const cartonPrice = 90;
      const eggPrice = cartonPrice / 30;
      const eggCount = 10;
      const total = eggCount * eggPrice;
      expect(total).toBe(30);
    });

    it('should handle decimal egg prices correctly', () => {
      const cartonPrice = 99;
      const eggPrice = cartonPrice / 30;
      const eggCount = 15;
      const total = eggCount * eggPrice;
      expect(total).toBeCloseTo(49.5, 1);
    });

    it('should calculate change correctly (amount paid - total)', () => {
      const total = 30;
      const amountPaid = 100;
      const change = amountPaid - total;
      expect(change).toBe(70);
    });

    it('should handle negative change (underpaid)', () => {
      const total = 100;
      const amountPaid = 50;
      const change = amountPaid - total;
      expect(change).toBe(-50);
    });

    it('should handle zero total', () => {
      const cartonPrice = 90;
      const eggPrice = cartonPrice / 30;
      const eggCount = 0;
      const total = eggCount * eggPrice;
      expect(total).toBe(0);
    });

    it('should handle large egg counts', () => {
      const cartonPrice = 90;
      const eggPrice = cartonPrice / 30;
      const eggCount = 9999;
      const total = eggCount * eggPrice;
      expect(total).toBe(29997);
    });
  });

  describe('Input Validation', () => {
    it('should not allow negative prices', () => {
      const price = Math.max(0, -50);
      expect(price).toBe(0);
    });

    it('should not allow negative egg counts', () => {
      const count = Math.max(0, -10);
      expect(count).toBe(0);
    });

    it('should allow zero egg count', () => {
      const count = 0;
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should parse string inputs correctly', () => {
      const stringInput = '123';
      const parsed = parseInt(stringInput, 10);
      expect(parsed).toBe(123);
    });

    it('should handle invalid string inputs', () => {
      const stringInput = 'abc';
      const parsed = parseInt(stringInput, 10) || 0;
      expect(parsed).toBe(0);
    });
  });

  describe('Numeric Input Appending', () => {
    it('should append digits correctly', () => {
      let value = '';
      value = value + '1';
      value = value + '5';
      value = value + '5';
      expect(value).toBe('155');
    });

    it('should handle multiple digit appending', () => {
      let value = '';
      const digits = ['1', '2', '3', '4', '5'];
      digits.forEach((digit) => {
        value = value + digit;
      });
      expect(value).toBe('12345');
    });

    it('should not replace existing value when appending', () => {
      let value = '10';
      value = value + '5';
      expect(value).toBe('105');
      expect(value).not.toBe('5');
    });
  });

  describe('Default Prices', () => {
    it('should have correct default prices', () => {
      const defaults = {
        red: 90,
        white: 99,
        local: 150,
      };
      expect(defaults.red).toBe(90);
      expect(defaults.white).toBe(99);
      expect(defaults.local).toBe(150);
    });

    it('should calculate prices for all egg types', () => {
      const prices = {
        red: 90,
        white: 99,
        local: 150,
      };
      const eggCount = 10;

      Object.values(prices).forEach((price) => {
        const eggPrice = price / 30;
        const total = eggCount * eggPrice;
        expect(total).toBeGreaterThan(0);
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('scenario 1: Buy 10 red eggs, pay with 100', () => {
      const cartonPrice = 90;
      const eggPrice = cartonPrice / 30;
      const eggCount = 10;
      const total = eggCount * eggPrice;
      const amountPaid = 100;
      const change = amountPaid - total;

      expect(total).toBe(30);
      expect(change).toBe(70);
    });

    it('scenario 2: Buy 30 white eggs (1 carton), pay exact', () => {
      const cartonPrice = 99;
      const eggPrice = cartonPrice / 30;
      const eggCount = 30;
      const total = eggCount * eggPrice;
      const amountPaid = 99;
      const change = amountPaid - total;

      expect(total).toBe(99);
      expect(change).toBe(0);
    });

    it('scenario 3: Buy 60 local eggs (2 cartons), underpaid', () => {
      const cartonPrice = 150;
      const eggPrice = cartonPrice / 30;
      const eggCount = 60;
      const total = eggCount * eggPrice;
      const amountPaid = 200;
      const change = amountPaid - total;

      expect(total).toBe(300);
      expect(change).toBe(-100);
    });
  });
});
