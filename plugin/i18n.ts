import VueI18n from 'vue-i18n';

const messages = {
  en: {
    message: {
      time: 'hello world',
    },
  },
  ja: {
    message: {
      hello: 'こんにちは、世界',
    },
  },
};

export default new VueI18n({
  locale: 'ja', // set locale
  messages, // set locale messages
});
