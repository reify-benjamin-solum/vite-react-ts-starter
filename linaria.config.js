const shaker = require('@linaria/shaker').default;

module.exports = {
  classNameSlug: '[title]',
  displayName: process.env.NODE_ENV !== 'production',
  rules: [
    {
      action: shaker,
    },
    {
      test: /\/node_modules\//,
      action: 'ignore',
    },
    {
      test: /\/node_modules\/antd\/es\//,
      action: shaker,
    },
  ],
};
