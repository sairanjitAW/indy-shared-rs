const path = require('path')

const indyCredxShared = require('../shared/package.json')

module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [indyCredxShared.name]: path.join(__dirname, '../shared', indyCredxShared.source),
        },
      },
    ],
  ],
}
