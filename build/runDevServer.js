const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

process.env.WEBPACK = true; // css will only be required during webpack bundling

const contentBase = 'http://localhost:8081';

const config = {
  entry: [
    `webpack-dev-server/client?${contentBase}`,
    'webpack/hot/only-dev-server',
    './app/client.js',
  ],
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: `${contentBase}/`,
    filename: 'webpack-bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [
          'react-hot',
          'babel',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css'
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        WEBPACK: JSON.stringify(true),
      },
    }),
  ],
};

const compiler = webpack(config);

const devServerOptions = {
  contentBase,
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
};

const webpackDevServer = new WebpackDevServer(compiler, devServerOptions);

webpackDevServer.listen(8081);
