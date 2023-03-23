import * as ObjectChecker from './object-checker';

export const validate = (
  config: Record<string, unknown>,
  fieldName = 'config',
) => {
  const emptyValuesList = [];
  const addToList = (fieldName: string) => emptyValuesList.push(fieldName);

  ObjectChecker.checkIfHasEmptyFields(config, fieldName, addToList);

  if (emptyValuesList.length > 0)
    throw new Error(
      `The config file has empty values. The following env variables is missing: "${emptyValuesList.join(
        ', ',
      )}"`,
    );
};
