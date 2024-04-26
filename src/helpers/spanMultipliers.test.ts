import { test, expect, describe } from 'vitest';

import moment from 'moment';
import {
  activeSpanMultiplier,
  inactiveSpanMultiplier,
} from './spanMultipliers';

// 17-21: x1
// 21-24: x1.5
// 24-06: x2
// 06-08: x1

describe('activeSpanMultipliers', () => {
  test('1 hour, 1 mult', () => {
    const start = moment('2024-04-24 17:00');
    const end = moment('2024-04-24 18:00');
    const sum = activeSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('1.00');
  });

  test('1 hour, 1.5 mult', () => {
    const start = moment('2024-04-24 21:00');
    const end = moment('2024-04-24 22:00');
    const sum = activeSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('1.50');
  });

  test('1 hour, 2 mult', () => {
    const start = moment('2024-04-24 24:00');
    const end = moment('2024-04-25 01:00');
    const sum = activeSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('2.00');
  });

  test('15 hour', () => {
    const start = moment('2024-04-24 17:00');
    const end = moment('2024-04-25 08:00');
    const sum = activeSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('22.50');
  });
});

describe('inactiveSpanMultiplier', () => {
  test('1 hour, weekday', () => {
    const start = moment('2024-04-24 17:00');
    const end = moment('2024-04-24 18:00');
    const sum = inactiveSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('0.25');
  });
  test('1 other hour, weekday', () => {
    const start = moment('2024-04-25 02:00');
    const end = moment('2024-04-25 03:00');
    const sum = inactiveSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('0.25');
  });
  test('10 other hour, weekday', () => {
    const start = moment('2024-04-24 18:00');
    const end = moment('2024-04-25 04:00');
    const sum = inactiveSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('2.50');
  });

  test('1 hour, weekend', () => {
    const start = moment('2024-04-26 17:00');
    const end = moment('2024-04-26 18:00');
    const sum = inactiveSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('0.50');
  });
  test('1 other hour, weekend', () => {
    const start = moment('2024-04-26 01:00');
    const end = moment('2024-04-26 02:00');
    const sum = inactiveSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('0.50');
  });
  test('10 other hour, weekend', () => {
    const start = moment('2024-04-26 17:00');
    const end = moment('2024-04-27 03:00');
    const sum = inactiveSpanMultiplier(start, end);

    const roundedSum = sum.toFixed(2);
    expect(roundedSum).toBe('5.00');
  });
});

describe('inactiveSpanMultiplier and activeSpanMultiplier', () => {
  test('Tove example', () => {
    let sum = 0;

    const start1 = moment('2024-04-24 17:00');
    const end1 = moment('2024-04-25 04:40');
    sum += activeSpanMultiplier(start1, end1);

    const start2 = moment('2024-04-25 04:40');
    const end2 = moment('2024-04-25 05:00');
    sum += inactiveSpanMultiplier(start2, end2);

    const start3 = moment('2024-04-25 05:00');
    const end3 = moment('2024-04-25 06:10');
    sum += activeSpanMultiplier(start3, end3);

    const start4 = moment('2024-04-25 06:10');
    const end4 = moment('2024-04-25 07:00');
    sum += inactiveSpanMultiplier(start4, end4);

    const start5 = moment('2024-04-25 07:00');
    const end5 = moment('2024-04-25 08:00');
    sum += activeSpanMultiplier(start5, end5);

    const roundedSum = sum.toFixed(2);

    expect(roundedSum).toBe('21.29');
  });
});
