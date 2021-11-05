module.exports = {
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: [
    "prettier",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [
    ".eslintrc.js",
    "**/*.js",  // 暂时先禁止js的lint，慢慢开放
    "node_modules",
    "**/transfer/dto/**/*",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",  // 检查 import React
    "max-len": "off",
    "jsx-a11y/click-events-have-key-events": "off",   // 无障碍-绑定键盘事件
    "jsx-a11y/no-static-element-interactions": "off",  // 无障碍-role
    "no-restricted-syntax": [ // 放开airbnb规则中对for-of的禁止
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      // {
      //   selector: 'ForOfStatement',
      //   message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      // },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    "react/require-default-props": "off",   // default props
    "prefer-destructuring": [
      "error", {
        "array": false,
        "object": true,
      }, {
        "enforceForRenamedProperties": false,
      },
    ],
    "react/jsx-props-no-spreading": "off",
    "no-nested-ternary": "off",
    "no-continue": "off",
    "no-plusplus": "off",
    "no-param-reassign": [  // 禁止重新赋值函数参数：允许对参数上的属性进行修改
      'error',
      {
        props: false,
      },
    ],
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off",
    // 改为warning
    "prefer-template": "warn",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/no-use-before-define": "warn",
    "import/extensions": ["off"],
  },
};
