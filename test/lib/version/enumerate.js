require('should');

const basedir = `${__dirname}/../../..`;

describe('lib/version/upgrade/enumerate', () => {
  const Enumerate = require(`${basedir}/lib/version/enumerate.js`);

  describe('#all', () => {
    it('should return an empty array for invalid directory', () => {
      const enumerate = new Enumerate('test/fixtures/version/invalid');
      return enumerate.all().should.be.eql([]);
    });

    it('should return an empty array if no version in directory', () => {
      const enumerate = new Enumerate('test/fixtures/version');
      return enumerate.all()
        .should.be.eql([]);
    });

    it('should return an array of reverse sorted version files and not be recursive', () => {
      const enumerate = new Enumerate('test/fixtures/version/upgrade');
      return enumerate.all()
        .should.be.eql(['1.0.1', '1.0.0']);
    });
  });

  describe('#latest', () => {
    it('should return the highest version', () => {
      const enumerate = new Enumerate('test/fixtures/version/upgrade');
      enumerate.latest().should.be.eql('1.0.1');
    });
  });

  describe('#first', () => {
    it('should return the lowest version', () => {
      const enumerate = new Enumerate('test/fixtures/version/upgrade');
      enumerate.first().should.be.eql('1.0.0');
    });
  });

  describe('#map', () => {
    it('should apply callback on all version items in Enumerate instance context', () => {
      const enumerate = new Enumerate('test/fixtures/version/upgrade');
      enumerate.map(function formatCallback(item) {
        return `passed ${item} ${this.latest()}`;
      })
        .should.be.eql(['passed 1.0.1 1.0.1', 'passed 1.0.0 1.0.1']);
    });
  });
});
