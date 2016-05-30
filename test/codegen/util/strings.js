/* global describe, it */
import { expect } from 'chai';

import { slug } from '../../../src/codegen/util/strings';

describe('util.strings', () => {
  it('generates a slug from simple string', () => {
    const created = slug('someObject');
    expect(created).to.equal('someobject');
  });

  it('generates a slug from string w/ spaces', () => {
    const created = slug('some Object');
    expect(created).to.equal('some-object');
  });

  it('generates a slug from string w/ underscores', () => {
    const created = slug('some_Object');
    expect(created).to.equal('some-object');
  });

  it('generates a slug from string w/ spaces, underscores and hyphens', () => {
    const created = slug('some_Object with-many spaces');
    expect(created).to.equal('some-object-with-many-spaces');
  });

  it('generates a slug from string w/ lots of noise', () => {
    const created = slug('some1@#$*Obj%#ect)$with02034many;,spaces');
    expect(created).to.equal('some1objectwith02034manyspaces');
  });
});
