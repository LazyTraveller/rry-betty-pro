const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        use: [
            {
                loader: "style-loader",
            },
            {
                loader: "css-loader",
                options: {
                    importLoaders: 1,
                },
            },
            {
                loader: "less-loader",
                options: {
                    javascriptEnabled: true,
                },
            },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader"
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'pro',
      template: 'dist/index.html'
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin()
  ],
  
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    historyApiFallback: true,
    compress: true,
  }
}