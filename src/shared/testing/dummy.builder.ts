import { Plain } from '@shared/infra-objects/types';

export class DummyBuilder<T extends Record<string, any>> {
  private dummy: T;

  constructor(dummy = {} as T) {
    this.dummy = dummy;
  }

  public withFields(fields: Partial<T> = {}): DummyBuilder<T> {
    Object.entries(fields).forEach(([field, value]) => {
      this.dummy[field as keyof T] = value as T[keyof T];
    });
    return this;
  }

  public withoutFields(...fields: Array<keyof T>): DummyBuilder<T> {
    Object.keys(this.dummy).forEach((key) => {
      if (fields.includes(key)) delete this.dummy[key];
    });
    return this;
  }

  public build(): T {
    return this.dummy;
  }

  public buildPlain(): Plain<T> {
    return Object.entries(this.dummy)
      .filter(([, value]) => typeof value === 'function')
      .reduce((newMock: Plain<T>, [field, value]) => {
        newMock[field as keyof T] = value as T[keyof T];
        return newMock;
      }, {} as Plain<T>);
  }
}
