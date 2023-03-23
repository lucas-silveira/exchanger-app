export class MockBuilder<T extends Record<any, any>> {
  private mock: T;

  constructor(mock: T) {
    this.mock = mock;
  }

  public withFields(fields: Partial<T> = {}): MockBuilder<T> {
    Object.entries(fields).forEach(([field, value]) => {
      this.mock[field as keyof T] = value as T[keyof T];
    });
    return this;
  }

  public withoutFields(...fields: Array<keyof T>): MockBuilder<T> {
    Object.keys(this.mock).forEach((key) => {
      if (fields.includes(key)) delete this.mock[key];
    });
    return this;
  }

  public build(): T {
    return this.mock;
  }
}
