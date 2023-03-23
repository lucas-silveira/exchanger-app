import * as Tests from '@shared/testing';
import { ValueObject } from '../value-object';

Tests.unitScope('ValueObject', () => {
  class TestObj extends ValueObject {
    constructor(public readonly x: unknown, public readonly y: unknown) {
      super();
    }
  }

  describe('creation', () => {
    it('Should be able to create a ValueObject child correctly', () => {
      expect(new TestObj(1, 1)).toEqual({ x: 1, y: 1 });
    });
  });

  describe('isEqualTo', () => {
    it('Should be able to get true if two objects are equals', () => {
      const obj1 = new TestObj(1, 2);
      const obj2 = new TestObj(1, 2);
      const obj3 = new TestObj({ z: 1 }, 2);
      const obj4 = new TestObj({ z: 1 }, 2);

      expect(obj1.isEqualTo(obj1)).toBe(true);
      expect(obj1.isEqualTo(obj2)).toBe(true);
      expect(obj3.isEqualTo(obj4)).toBe(true);
    });

    it('Should be able to get false if two objects are not equals', () => {
      const obj1 = new TestObj(1, 2);
      const obj2 = new TestObj(2, 1);
      const obj3 = new TestObj(2, { z: 1 });
      const obj4 = new TestObj(2, { z: 2 });

      expect(obj1.isEqualTo({})).toBe(false);
      expect(obj1.isEqualTo(obj2)).toBe(false);
      expect(obj3.isEqualTo(obj4)).toBe(false);
    });
  });
});
