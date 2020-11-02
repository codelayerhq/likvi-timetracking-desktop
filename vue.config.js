module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.ts",
      builderOptions: {
        productName: "likvi Zeiterfassung",
        appId: "de.likvi.timetracking",
        afterSign: "electron-builder-notarize",
        mac: {
          hardenedRuntime: true,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist",
          category: "public.app-category.productivit",
          publish: ["github"],
        },
        win: {
          publish: ["github"],
        },
        linux: {
          publish: ["github"],
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
