require('babel-register');

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// cleans out the previously generated CSS and JS files
rimraf.sync(path.resolve(__dirname, '../public/js'));
rimraf.sync(path.resolve(__dirname, '../public/css'));

const config = {
  entry: ['./app/client.js'],
  output: {
    path: path.resolve(__dirname, '../public/js'),
    filename: 'main.[hash].js', // this hash gets stored in a json file that is used when rendering the HTML on the server
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          compact: true,
        },
      },
      {
        test: /\.css$/,
        // extract CSS and save it as a file.
        loader: ExtractTextPlugin.extract('css'),
      },
    ],
  },
  bail: true,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
    }),
    // could use DedupePlugin and/or OccurrenceOrderPlugin
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ExtractTextPlugin('../css/main.[hash].css'),
  ],
};

webpack(config, (err, stats) => {
  err && console.error(err);
  if (err) {
    console.log('Error compiling:', err);
    return;
  }

  // Both the js and css files will be appended with a hash.
  // This code saves that hash in a file which is read by the server when it starts
  // using that file in the HTML returned to the client (e.g. main.c198aa1f983e8bc645d2.js)
  const statsFilePath = path.resolve(__dirname, '../build/assetHash.json');

  const jsonStats = stats.toJson({
    modules: false,
    chunks: false
  });

  fs.writeFileSync(statsFilePath, JSON.stringify(jsonStats.hash));
});

