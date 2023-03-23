import { DomainException } from '../infra-objects';

export const checkIfIsNotEmpty = (
  aValue: unknown,
  errMessage: string,
): void => {
  const isEmptyValue = aValue === null || aValue === undefined || aValue === '';
  const isEmptyObject =
    typeof aValue === 'object' &&
    !(aValue instanceof Date) &&
    !Object.keys(aValue || {}).length;
  const isEmptyArray = Array.isArray(aValue) && !aValue.length;
  const isEmpty = isEmptyValue || isEmptyObject || isEmptyArray;

  if (isEmpty) throw new DomainException(errMessage);
};

export const checkIfIsValidEnum = (
  anEnum: Record<string, unknown>,
  aValue: unknown,
  errMessage: string,
): void => {
  const isArray = Array.isArray(aValue);
  const validate = (value: unknown) => !Object.values(anEnum).includes(value);
  const isInvalid = isArray ? aValue.some(validate) : validate(aValue);

  if (isInvalid) throw new DomainException(errMessage);
};

export const checkIfLengthIsNotGreaterThan = (
  aValue: unknown,
  max: number,
  errMessage: string,
): void => {
  const isNotString = typeof aValue !== 'string';
  const isGreaterThanMax = (<string>aValue).length > max;

  if (isNotString || isGreaterThanMax) throw new DomainException(errMessage);
};

export const checkIfIsNotGreaterThan = (
  aValue: unknown,
  max: number,
  errMessage: string,
): void => {
  const isNotNumber = typeof aValue !== 'number';
  const isGreaterThanMax = aValue > max;

  if (isNotNumber || isGreaterThanMax) throw new DomainException(errMessage);
};

export const checkIfIsNotLessThan = (
  aValue: unknown,
  min: number,
  errMessage: string,
): void => {
  const isNotNumber = typeof aValue !== 'number';
  const isLessThanMin = aValue < min;

  if (isNotNumber || isLessThanMin) throw new DomainException(errMessage);
};

export const checkIfIsNumber = (aValue: unknown, errMessage: string): void => {
  if (typeof aValue !== 'number') throw new DomainException(errMessage);
};

export const checkIfIsInteger = (aValue: unknown, errMessage: string): void => {
  if (!Number.isInteger(aValue)) throw new DomainException(errMessage);
};
