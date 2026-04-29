const rspack = require('@rspack/core');
const { ModuleFederationPlugin } = rspack.container;
const path = require('path');

module.exports = {
  entry: './src/bootstrap.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:5011/',
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
      name: 'shellRspack',
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
    new rspack.HtmlRspackPlugin({ template: './public/index.html' }),
  ],
  devServer: {
    port: 5011,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
};
