module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.ts",
      builderOptions: {
        productName: "likvi Zeiterfassung",
        appId: "de.likvi.timetracking",
        mac: {
          category: "public.app-category.productivit",
        },
      },
    },
  },
  configureWebpack: {
    externals: {
      moment: "moment",
    },
  },
};
