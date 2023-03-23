import { isEqual } from 'lodash';

export abstract class ValueObject {
  protected setReadOnlyProperty<K extends keyof this>(
    propertyName: K,
    value: this[K],
  ): void {
    this[propertyName] = value;
  }

  public isEqualTo(anObject: Record<string, any>): boolean {
    if (this === anObject) return true;
    if (!(anObject instanceof ValueObject)) return false;
    return isEqual(this, anObject);
  }
}
