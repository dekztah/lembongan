// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = {
  // configureWebpack: {
  //   plugins: [new BundleAnalyzerPlugin()]
  // },
  // configureWebpack: config => {
  //   console.log("x", config.optimization);
  // },

  productionSourceMap: process.env.NODE_ENV !== "production"
};
