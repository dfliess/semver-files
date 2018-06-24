const globfs = require('glob-fs');
const semverSort = require('semver-sort');

class SemverFiles {
  constructor(directory, options) {
    this.directory = directory;
    this.versions = null;
    this.fileInfos = {};
    this.options = Object.assign({}, SemverFiles.defaultOptions, options || {});
  }

  static get SemverPattern() {
    /* eslint-disable no-useless-escape */
    return '\\bv?((?:0|[1-9]\\d*)\.(?:0|[1-9]\\d*)\.(?:0|[1-9]\\d*)(?:-[\\da-zA-Z\\-]+(?:\.[\\da-zA-Z\\-]+)*)?(?:\\+[\\da-zA-Z\\-]+(?:\.[\\da-zA-Z\\-]+)*)?)\\b';
    /* eslint-enable no-useless-escape */
  }

  static get extPattern() {
    /* eslint-disable no-useless-escape */
    return '\\.js';
    /* eslint-enable no-useless-escape */
  }

  static get defaultOptions() {
    return {
      extractVersionPattern: SemverFiles.SemverPattern,
      extPattern: SemverFiles.extPattern,
      matchIndex: 1
    };
  }

  getOption(name) {
    return this.options[name];
  }

  setOption(name, value) {
    this.options[name] = value;
    return this;
  }

  all() {
    if (this.versions !== null) {
      return this.versions;
    }
    const files = [];
    this.fileInfos = {};
    const versionRegex = new RegExp(`^${this.getOption('extractVersionPattern')}${this.getOption('extPattern')}$`);
    try {
      globfs()
        .use((currentFile) => {
          const file = currentFile;
          if (!file.isDirectory() && file.pattern.glob.indexOf('**') === -1 && versionRegex.test(file.basename)) {
            file.include = true;
          }
          return file;
        })
        .on('include', (file) => {
          const matches = versionRegex.exec(file.basename);
          if (matches === null) {
            return;
          }
          const versionNumber = matches[this.getOption('matchIndex')];
          if (files.indexOf(versionNumber) === -1) {
            files.push(versionNumber);
            this.fileInfos[versionNumber] = file.relative;
          }
        })
        .readdirSync(this.directory);
    } catch (e) {
      // If this.directory does not exist, we have no file
    }
    this.versions = semverSort.desc(files);
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

  getPath(version) {
    this.all();
    if (this.fileInfos[version] === undefined) {
      return null;
    }
    return this.fileInfos[version];
  }

  getPaths() {
    this.all();
    return this.fileInfos;
  }
}

module.exports = SemverFiles;
