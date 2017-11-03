const globfs = require('glob-fs')();
const semverSort = require('semver-sort');

class VersionFiles
{
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
				.use(function (file) {
					if (!file.isDirectory() && file.pattern.glob.indexOf('**') === -1) {
						file.include = true;
					}
					return file;
				})
				.on('include', function (file) {
					files.push(file.basename.replace(/\.js$/, ''));
				})
				.readdirSync(`${this.directory}/*.js`);
			} catch (e) { 
			}
			this.versions = semverSort.desc(files);
		}
		return this.versions;
	}

	first() {
		const versions = this.all();
		return versions.length ? versions[Object.keys(versions)[versions.length-1]] : undefined;
	}

	latest() {
		const versions = this.all();
		return versions.length ? versions[Object.keys(versions)[0]] : undefined;
	}

	map(callback) {
		return this.all().map(callback, this)
	}
}

module.exports = VersionFiles;
