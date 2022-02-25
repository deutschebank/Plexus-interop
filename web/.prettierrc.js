module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  importOrder: [
    'polyfills?$',
    '<THIRD_PARTY_MODULES>',
    '^@plexus',
    '^[./](?!.*[.]s?css$).*$',
    '.*css$',
  ],
  importOrderSeparation: true,
  importOrderCaseInsensitive: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: [
    'typescript',
    'classProperties',
    'decorators-legacy',
  ],
  overrides: [
    {
      files: '*.ts',
      options: {
        printWidth: 120,
      },
    },
  ],
};
