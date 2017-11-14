module.exports = {
  'extends': 'airbnb-base',
  'env': {
    'node': true,
    'mocha': true
  },
  'rules': {
    'no-console': [1, {
      'allow': ['warn']
    }],
    'comma-dangle': ['error', {
      'functions': 'never',
      'arrays' : 'ignore',
      'objects': 'ignore',
      'exports': 'never',
      'imports': 'never'
    }]
  },
  'overrides': [
    {
      'files': ['test/**/*.js'],
      'rules': {
        'import/no-extraneous-dependencies': ["error", {"devDependencies": true}],
        'import/no-dynamic-require':'off',
        'global-require': 'off'
      }
    }
  ]
};
