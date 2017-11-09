const globfs = require('glob-fs')();
const semverSort = require('semver-sort');

class VersionFiles {
  constructor(directory, options) {
    this.directory = directory;
    this.versions = null;
    this.options = options || {};
  }

  all() {
    if (this.versions === null) {
      const files = [];
      try {
        globfs
          .use((currentFile) => {
            const file = currentFile;
            if (!file.isDirectory() && file.pattern.glob.indexOf('**') === -1) {
              file.include = true;
            }
            return file;
          })
          .on('include', (file) => {
            files.push(file.basename.replace(/\.js$/, ''));
          })
          .readdirSync(`${this.directory}/*.js`);
      } catch (e) {
        // If this.directory does not exist, we have no file
      }
      this.versions = semverSort.desc(files);
    }
    return this.versions;
  }

  first() {
    const versions = this.all();
    return versions.length ? versions[Object.keys(versions)[versions.length - 1]] : undefined;
  }

  latest() {
    const versions = this.all();
    return versions.length ? versions[Object.keys(versions)[0]] : undefined;
  }

  /**
   * Apply a callback on all version items in the instance context
   * @param callback
   */
  map(callback) {
    return this.all().map(callback, this);
  }
}

module.exports = VersionFiles;
