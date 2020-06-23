module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PUBLIC_PATH : '/',
  productionSourceMap: false,
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'assets/locales',
      enableInSFC: false,
    },
    electronBuilder: {
      customFileProtocol: 'mikazuki://./',
      nodeIntegration: true,
      builderOptions: {
        appId: 'nicoaiko.mikazuki.moe',
        publish: null,
        mac: {
          category: 'public.app-category.utilities',
        },
        linux: {
          category: 'Utility',
        },
      },
    },
  },
  chainWebpack(config) {
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  },
};
