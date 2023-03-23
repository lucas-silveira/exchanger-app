import * as Tests from '@shared/testing';
import { round } from '../math';

Tests.unitScope('Math', () => {
  it('Should be able to round a number', () => {
    expect(round(12)).toBe(12);
    expect(round(12.3)).toBe(12.3);
    expect(round(12.33)).toBe(12.33);
    expect(round(12.333)).toBe(12.33);
    expect(round(12.331)).toBe(12.33);
    expect(round(12.335)).toBe(12.34);
    expect(round(12.336)).toBe(12.34);
    expect(round(12.336)).toBe(12.34);
    expect(round(12.3333)).toBe(12.33);
    expect(round(12.3331)).toBe(12.33);
    expect(round(12.3335)).toBe(12.33);
    expect(round(12.3336)).toBe(12.33);
    expect(round(12.3446)).toBe(12.34);
  });
});
