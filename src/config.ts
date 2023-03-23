import * as Utils from '@shared/utils';

export const makeConfig = () =>
  ({
    app: {
      httpPort: Number(process.env.APP_HTTP_PORT),
    },
  } as const satisfies Record<string, unknown>);

export const makeConfigAndValidate = () => {
  const config = makeConfig();
  if (process.env.NODE_ENV !== 'test') Utils.ConfigValidator.validate(config);
  return config;
};
