const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/bootstrap.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:5001/',
    filename: '[name].bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      exposes: {
        './UserStore': './src/store/userStore',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0', eager: true },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0', eager: true },
        zustand: { singleton: true, requiredVersion: '^4.0.0', eager: true },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
  devServer: {
    port: 5001,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
};
