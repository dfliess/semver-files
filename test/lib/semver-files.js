const should = require('should');

const basedir = `${__dirname}/../..`;

describe('lib/version/upgrade/enumerate', () => {
  const Enumerate = require(`${basedir}/lib/semver-files.js`);

  describe('#all', () => {
    it('should return an empty array for invalid directory', () => {
      const enumerate = new Enumerate('test/fixtures/version/invalid');
      return enumerate.all().should.be.eql([]);
    });

    it('should return an empty array if no version in directory', () => {
      const enumerate = new Enumerate('test/fixtures');
      return enumerate.all()
        .should.be.eql([]);
    });

    it('should return an array of reverse sorted version files and not be recursive', () => {
      const enumerate = new Enumerate('test/fixtures/version');
      return enumerate.all()
        .should.be.eql(['1.0.1', '1.0.0']);
    });

    it('should return an array of reverse sorted version files and not be recursive with glob recursive pattern', () => {
      const enumerate = new Enumerate(
        'test/fixtures/version',
        {
          extractVersionPattern: `(test-)${Enumerate.SemverPattern}`,
          matchIndex: 2
        }
      );
      return enumerate.all()
        .should.be.eql(['1.0.3', '1.0.0', '1.0.0-RC2', '1.0.0-RC1']);
    });

    it('should return an array of reverse sorted version only of files with .txt extension', () => {
      const enumerate = new Enumerate(
        'test/fixtures/version',
        {
          extPattern: '\\.txt'
        }
      );
      return enumerate.all()
        .should.be.eql(['1.0.2', '1.0.0']);
    });

    it('should return an array of reverse sorted version only of files with .txt or .js extension', () => {
      const enumerate = new Enumerate(
        'test/fixtures/version',
        {
          extPattern: '\\.(txt|js)'
        }
      );
      return enumerate.all()
        .should.be.eql(['1.0.2','1.0.1','1.0.0']);
    });

  });

  describe('#latest', () => {
    it('should return the highest version', () => {
      const enumerate = new Enumerate('test/fixtures/version');
      enumerate.latest().should.be.eql('1.0.1');
    });
  });

  describe('#first', () => {
    it('should return the lowest version', () => {
      const enumerate = new Enumerate('test/fixtures/version');
      enumerate.first().should.be.eql('1.0.0');
    });
  });

  describe('#map', () => {
    it('should apply callback on all version items in Enumerate instance context', () => {
      const enumerate = new Enumerate('test/fixtures/version');
      enumerate.map(function formatCallback(item) {
        return `passed ${item} ${this.latest()}`;
      })
        .should.be.eql(['passed 1.0.1 1.0.1', 'passed 1.0.0 1.0.1']);
    });
  });

  describe('#getPath', () => {
    it('should return the file relative path for a matching file version', () => {
      const enumerate = new Enumerate('test/fixtures/version');
      enumerate.getPath('1.0.1')
        .should.be.eql('test/fixtures/version/1.0.1.js');
    });
    it('should return null for a non existing file version', () => {
      const enumerate = new Enumerate('test/fixtures/version');
      should(enumerate.getPath('1.0.5')).be.null();
    });
  });

  describe('#getPaths', () => {
    it('should return an object of file relative paths for all matching files', () => {
      const enumerate = new Enumerate('test/fixtures/version');
      enumerate.getPaths()
        .should.be.eql({
          '1.0.0': 'test/fixtures/version/1.0.0.js',
          '1.0.1': 'test/fixtures/version/1.0.1.js',
        });
    });
    it('should return an empty object when no file match', () => {
      const enumerate = new Enumerate('test/fixtures');
      enumerate.getPaths()
        .should.be.eql({});
    });

    it('should return an object of file relative paths for all matching files with .txt or .js extension, with more than one it choose alphabetically', () => {
      const enumerate = new Enumerate(
        'test/fixtures/version',
        {
          extPattern: '\\.(txt|js)'
        }
      );
      return enumerate.getPaths()
        .should.be.eql(
          {
            '1.0.0': 'test/fixtures/version/1.0.0.js',
            '1.0.1': 'test/fixtures/version/1.0.1.js',
            '1.0.2': 'test/fixtures/version/1.0.2.txt',
          }
        );
    });

  });

});
