const path = require("path");
const webpack = require("webpack");
const packageJson = require("./package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const _DEV_ = process.env.NODE_ENV === "development";

const config = {
  mode: process.env.NODE_ENV || "production",
  entry: _DEV_ ? path.resolve(__dirname, "./src/index.ts") : path.resolve(__dirname, "./src/core/mvvm.ts"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "mvvm.js",
    library: "mvvm",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [new webpack.BannerPlugin(`${packageJson.name} v${packageJson.version}`), new ForkTsCheckerWebpackPlugin()]
};
if (_DEV_) {
  config.devtool = "eval-source-map";
  config.devServer = {
    stats: "errors-only",
    contentBase: path.join(__dirname, "dist"),
    overlay: true
  };
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html")
    })
  );
}
if (process.env.MODE === "analysis") {
  config.plugins.push(new BundleAnalyzerPlugin());
}
module.exports = config;
