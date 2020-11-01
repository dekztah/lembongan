// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
// .BundleAnalyzerPlugin;

module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer("terser").tap(args => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.output = {
          ...args[0].terserOptions.output,
          comments: false
        };
        return args;
      });
    }
  },
  // configureWebpack: {
  //   plugins: [new BundleAnalyzerPlugin()]
  // },
  productionSourceMap: process.env.NODE_ENV !== "production"
};
