const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.join(__dirname, 'src/index.ts'),
  devtool: 'cheap-source-map',
  externals: [
    nodeExternals(),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  },
  target: 'node',
  output: {
    filename: 'bundle.js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    path: path.join(__dirname, 'dist'),
  }
};