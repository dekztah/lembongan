module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        corejs: 3,
        targets: {
          browsers: ["last 2 versions", "safari > 8", "not ie < 11"]
        }
      }
    ]
  ]
};
