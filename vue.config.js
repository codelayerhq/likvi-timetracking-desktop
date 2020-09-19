module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.ts",
      builderOptions: {
        productName: "likvi Zeiterfassung",
      },
    },
  },
  configureWebpack: {
    externals: {
      moment: "moment",
    },
  },
};
