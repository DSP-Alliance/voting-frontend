const path = require('path');
const prod = process.env.NODE_ENV === 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: __dirname + '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      constants: path.resolve(__dirname, 'src/constants/'),
      services: path.resolve(__dirname, 'src/services/'),
      utilities: path.resolve(__dirname, 'src/utilities/'),
      process: path.resolve(__dirname, "./node_modules/process/"),
    },
    fallback: { "stream": require.resolve("stream-browserify"), process: require.resolve('process/browser') }
  },
  devtool: prod ? undefined : 'cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
};
