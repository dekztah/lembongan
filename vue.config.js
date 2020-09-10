// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = {
  // configureWebpack: {
  //   plugins: [new BundleAnalyzerPlugin()]
  // },
  productionSourceMap: process.env.NODE_ENV !== "production"
};
