const isProd = process.env.NODE_ENV === 'production';

const externals = isProd ? { 'vuetify/lib': 'vuetify/lib' } : {};

module.exports = {
  configureWebpack: {
    externals,
  },
  css: {
    extract: false,
  },
  transpileDependencies: ['vuetify'],
};
