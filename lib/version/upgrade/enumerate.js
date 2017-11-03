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
			return globfs
			.use(function (file) {
				if (!file.isDirectory() && file.pattern.glob.indexOf('**') === -1) {
					file.include = true;
				}
				return file;
			})
			.on('include', function (file) {
				files.push(file.basename.replace(/\.js$/, ''));
			})
			.readdirPromise(`${this.directory}/*.js`)
    		.then(() => {
						this.versions = semverSort.desc(files);
			      return Promise.resolve(this.versions);
		    })
				.catch(() => {
						this.versions = [];
						return Promise.resolve(this.versions);
				})
		}
		return Promise.resolve(this.versions);
	}

	latest() {
		return this.all()
			.then((versions) => Promise.resolve(versions.length ? versions[Object.keys(versions)[0]] : undefined));
	}

	map(callback) {
		return this.all()
			.then((versions) => Promise.resolve(versions.map(callback, this)))
	}
}

module.exports = VersionFiles;
