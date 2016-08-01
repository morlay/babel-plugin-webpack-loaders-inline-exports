require('babel-core/register')({
  plugins: [
    [
      require('../lib/index').default,
      {
        config: './examples/webpack.config.js',
      },
    ],
  ],
});

require('./main');