module.exports = {
  parser: 'babel-eslint',
  plugins: ['jsx-a11y', 'react', 'dollar-sign'],
  extends: ['plugin:prettier/recommended'],
  env: {
    browser: true,
    es6: true,
    jest: true,
    jquery: true,
    node: true,
  },
  rules: {
    // http://eslint.org/docs/rules/
    'array-bracket-spacing': ['warn', 'never'],
    'array-callback-return': 'warn',
    // camelcase: 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'comma-spacing': 'warn',
    curly: ['warn', 'all'],
    'default-case': ['warn', { commentPattern: '^no default$' }],
    'dot-location': ['warn', 'property'],
    'eol-last': 'warn',
    eqeqeq: ['warn', 'allow-null'],
    'func-call-spacing': 'warn',
    // indent: ['warn', 2, { SwitchCase: 1 }],
    'max-len': [
      'warn',
      {
        code: 180,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreUrls: true,
        ignoreComments: true,
      },
    ],
    'new-parens': 'warn',
    'no-array-constructor': 'warn',
    'no-caller': 'warn',
    'no-cond-assign': ['warn', 'always'],
    'no-const-assign': 'warn',
    'no-control-regex': 'warn',
    'no-delete-var': 'warn',
    'no-dupe-args': 'warn',
    'no-dupe-class-members': 'warn',
    'no-dupe-keys': 'warn',
    'no-duplicate-case': 'warn',
    'no-empty-character-class': 'warn',
    'no-empty-pattern': 'warn',
    'no-eval': 'warn',
    'no-ex-assign': 'warn',
    'no-extend-native': 'warn',
    'no-extra-bind': 'warn',
    'no-extra-label': 'warn',
    'no-fallthrough': 'warn',
    'no-func-assign': 'warn',
    'no-implied-eval': 'warn',
    'no-invalid-regexp': 'warn',
    'no-iterator': 'warn',
    'no-label-var': 'warn',
    'no-labels': ['warn', { allowLoop: false, allowSwitch: false }],
    'no-lone-blocks': 'warn',
    'no-loop-func': 'warn',
    'no-mixed-operators': [
      'warn',
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: false,
      },
    ],
    'no-multi-str': 'warn',
    'no-native-reassign': 'warn',
    'no-negated-in-lhs': 'warn',
    'no-new-func': 'warn',
    'no-new-object': 'warn',
    'no-new-symbol': 'warn',
    'no-new-wrappers': 'warn',
    'no-obj-calls': 'warn',
    'no-octal': 'warn',
    'no-octal-escape': 'warn',
    'no-redeclare': 'warn',
    'no-regex-spaces': 'warn',
    'no-restricted-syntax': ['warn', 'LabeledStatement', 'WithStatement'],
    'no-script-url': 'warn',
    'no-self-assign': 'warn',
    'no-self-compare': 'warn',
    'no-sequences': 'warn',
    'no-shadow-restricted-names': 'warn',
    'no-sparse-arrays': 'warn',
    'no-template-curly-in-string': 'warn',
    'no-this-before-super': 'warn',
    'no-throw-literal': 'warn',
    'no-trailing-spaces': 'warn',
    'no-undef': 'error',
    'no-unexpected-multiline': 'warn',
    'no-unreachable': 'warn',
    'no-unused-expressions': [
      'warn',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'no-unused-labels': 'warn',
    'no-unused-vars': [
      'warn',
      {
        vars: 'local',
        varsIgnorePattern: '^_',
        args: 'none',
      },
    ],
    'no-use-before-define': ['warn', 'nofunc'],
    'no-useless-computed-key': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-escape': 'warn',
    'no-useless-rename': [
      'warn',
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    'no-var': 'warn',
    'no-with': 'warn',
    'no-whitespace-before-property': 'warn',
    'operator-assignment': ['warn', 'always'],
    radix: ['warn', 'as-needed'],
    'require-yield': 'warn',
    'rest-spread-spacing': ['warn', 'never'],
    strict: ['warn', 'never'],
    'unicode-bom': ['warn', 'never'],
    'use-isnan': 'warn',
    'valid-typeof': 'warn',

    // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
    'react/jsx-closing-bracket-location': 'warn',
    'react/jsx-equals-spacing': ['warn', 'never'],
    'react/jsx-first-prop-new-line': ['warn', 'multiline'],
    // 'react/jsx-indent': ['warn', 2],
    'react/jsx-indent-props': ['warn', 2],
    'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }],
    'react/jsx-no-undef': 'warn',
    'react/jsx-pascal-case': [
      'warn',
      {
        allowAllCaps: true,
        ignore: [],
      },
    ],
    // 'react/jsx-sort-props': ['warn', { ignoreCase: true, callbacksLast: true, shorthandFirst: true, reservedFirst: true }],
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/no-danger-with-children': 'warn',
    'react/no-deprecated': 'warn',
    'react/no-direct-mutation-state': 'warn',
    'react/no-is-mounted': 'warn',
    'react/react-in-jsx-scope': 'error',
    'react/require-render-return': 'warn',
    'react/sort-comp': 'warn',
    'react/style-prop-object': 'warn',

    // https://github.com/airbnb/javascript/tree/master/react
    'react/prefer-es6-class': 'warn',
    'react/jsx-closing-tag-location': 'warn',
    'no-multi-spaces': 'warn',
    'react/jsx-tag-spacing': 'warn',
    'react/jsx-curly-spacing': 'warn',
    'react/jsx-boolean-value': 'warn',
    'react/no-string-refs': 'warn',
    'react/jsx-wrap-multilines': 'warn',
    'react/self-closing-comp': 'warn',

    // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
    'jsx-a11y/aria-role': ['warn', { ignoreNonDOM: true }],
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    'jsx-a11y/no-access-key': 'warn',

    'dollar-sign/dollar-sign': 'off',
  },
};
