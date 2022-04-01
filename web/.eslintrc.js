/*
 * Copyright 2017-2022 Plexus Interop Deutsche Bank AG
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const path = require('path');

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  plugins: ['jsdoc'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, 'packages/tsconfig.settings.json'),
    sourceType: 'module',
  },
  rules: {
    // TODO revisit post-prettier
    '@typescript-eslint/lines-between-class-members': 'off',
    // TODO differences of opinion
    'no-console': 'error',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    'prefer-template': 'warn',
    'no-param-reassign': 'warn',
    'no-await-in-loop': 'warn',
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      { overrides: { constructors: 'off' } },
    ],
    'arrow-body-style': 'warn',
    'prefer-destructuring': 'warn',
  },
  overrides: [
    {
      files: '*.js',
      parserOptions: {
        ecmaVersion: 6,
      },
      env: {
        jasmine: true,
      },
      rules: {
        'no-console': 'off',
        'global-require': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
