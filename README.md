# semver-files

A node module to list version files named with semantic version pattern.

## Installation

```bash
$ yarn install --save semver-files
```

## Usage

Given the following directory structure:

```
.
└── version
    ├── 1.0.0.js
    ├── 1.0.1.js
    ├── never-go-here
    │   └── 1.0.2.js
    ├── test-1.0.0.js
    ├── test-1.0.0-RC2.js
    ├── test-1.0.3.js
    └── test-v1.0.0-RC1.js
```

```js
const SemverFiles = require('semver-files');

const semver = new SemverFiles('./version');

console.log(semver).all();
//=> [ '1.0.1', '1.0.0' ]

console.log(semver).first();
//=> [ '1.0.0' ]

console.log(semver).latest();
//=> [ '1.0.1' ]

console.log(semver.map(function formatCallback(item) {
    return `${item}, latest is ${this.latest()}`;
}));
//=> [ '1.0.1, latest is 1.0.1', '1.0.0, latest is 1.0.1' ]

console.log(semver.getPath('1.0.0'));
//=> 'version/1.0.0.js'

console.log(semver.getPaths());
//=> { '1.0.0': 'version/1.0.0.js', '1.0.1': 'version/1.0.1.js' }
```

## API

The `SemverFiles` object.

### Constants

#### SemverPattern

The SemverPattern constant is a regexp string capturing a full semver version.

### Methods

#### SemverFiles.__construct(string directory, Object options)

Constructor to search semver files into directory `directory` with options `options`.

`directory` is a directory relative to main script.
`options` is an object of options. Possible keys are:

    - `extractVersionPattern` a custom regexp pattern that matches  (default `SemverFiles.SemverPattern`)
    - `matchIndex` is the index of the version captured from `extractVersionPattern` (default `1`)

#### all(): String[]

Return an array of versions matching `extractVersionPattern` option, sorted by descending version.

#### latest(): String|null

Return the highest version number.

#### first(): String|null

Return the least version number.

#### map(callback): Array

Apply a callback on all version items in the context of the ServerFiles instance.

#### getPath(version): String|null

Return the relative path of the file matching the version or null.

#### getPaths(): String|null

Return an object of the relative path of al the version files. Order is not guarantee.
