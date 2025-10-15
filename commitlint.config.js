export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'ui',
        'components',
        'pages',
        'utils',
        'styles',
        'config',
        'deps',
        'demo',
        'examples',
        'three',
        'canvas',
        'animation',
      ],
    ],
  },
};
