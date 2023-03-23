/*
  The three test scopes is based on Mike Cohn's Test Pyramid,
  which you can get more details here:
  https://martinfowler.com/articles/practical-test-pyramid.html
*/

enum TestScope {
  Unit = 'unit',
  Service = 'service',
  E2E = 'e2e',
  IO = 'io',
}

const envHasTheScope = (scope: TestScope): boolean => {
  if (!process.env.TEST_SCOPE) return true;

  return process.env.TEST_SCOPE?.includes(scope);
};

export const unitScope = envHasTheScope(TestScope.Unit)
  ? describe
  : describe.skip;

export const serviceScope = envHasTheScope(TestScope.Service)
  ? describe
  : describe.skip;

export const e2eScope = envHasTheScope(TestScope.E2E)
  ? describe
  : describe.skip;

export const ioScope = envHasTheScope(TestScope.IO) ? describe : describe.skip;
