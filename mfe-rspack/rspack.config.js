const rspack = require('@rspack/core');
const { ModuleFederationPlugin } = rspack.container;
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:5012/',
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
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: { react: { runtime: 'automatic' } },
            },
          },
        },
      },
      {
        test: /\.css$/,
        type: 'css',
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfeRspack',
      filename: 'remoteEntry.js',
      exposes: {
        './MfeApp': './src/App',
      },
      remotes: {
        shellRspack: 'shellRspack@http://localhost:5011/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0', eager: false },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0', eager: false },
        zustand: { singleton: true, requiredVersion: '^4.0.0', eager: false },
      },
    }),
    new rspack.HtmlRspackPlugin({ template: './public/index.html' }),
  ],
  devServer: {
    port: 5012,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
};
