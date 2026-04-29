const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:5002/',
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
      name: 'mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './MfeApp': './src/App',
      },
      remotes: {
        shell: 'shell@http://localhost:5001/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0', eager: false },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0', eager: false },
        zustand: { singleton: true, requiredVersion: '^4.0.0', eager: false },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
  devServer: {
    port: 5002,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
};
