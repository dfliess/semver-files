const should = require('should');
const basedir = `${__dirname}/../../../..`;

describe('lib/version/upgrade/enumerate', function () {
  const Enumerate = require(`${basedir}/lib/version/upgrade/enumerate.js`);

  describe('#all', function () {

    it('should return an empty array for invalid directory', function () {
      const enumerate = new Enumerate('test/fixtures/version/invalid');
        return enumerate.all().should.be.fulfilledWith([]);
    });

    it('should return an empty array if no version in directory', function () {
        const enumerate = new Enumerate('test/fixtures/version');
        return enumerate.all()
            .should.be.fulfilledWith([]);
    });
      
    it('should return an array of reverse sorted version files and not be recursive', function () {
        const enumerate = new Enumerate('test/fixtures/version/upgrade');
        return enumerate.all()
            .should.be.fulfilledWith(['1.0.1', '1.0.0']);
    });

  });

  describe('#latest', function () {
    it('should return the highest version', function () {
      const enumerate = new Enumerate('test/fixtures/version/upgrade');
      enumerate.latest().should.be.fulfilledWith('1.0.1');
    });
  });

  describe('#map', function () {
    it('should apply callback on all version items', function () {
      const enumerate = new Enumerate('test/fixtures/version/upgrade');
      enumerate.map(function (item) {
        return `passed ${item}`
      })
      .should.be.fulfilledWith(['passed 1.0.1', 'passed 1.0.0']);
    });
  });
});
