import { MockBuilder } from '../mock.builder';
import * as Tests from '../scopes';

Tests.unitScope('MockBuilder', () => {
  it('Should be able to build a mock object', () => {
    const mock = { a: 1, b: 2 };
    const builder = new MockBuilder(mock);
    expect(builder.build()).toEqual({ a: 1, b: 2 });
  });

  it('Should be able to add fields into a mock object and built it', () => {
    const mock = { a: 1, b: 2 };
    const builder = new MockBuilder(mock).withFields({ a: 2 });
    expect(builder.build()).toEqual({ a: 2, b: 2 });
  });

  it('Should be able to remove fields from mock object and built it', () => {
    const mock = { a: 1, b: 2 };
    const builder = new MockBuilder(mock).withoutFields('a');
    expect(builder.build()).toEqual({ b: 2 });
  });
});
