import Vue from 'vue';
import { VNode } from 'vue/types';

import vuetify from './plugins/vuetify';
import VDatetimePicker from '../plugin/index';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VDatetimePicker);

new Vue({
  vuetify,
  render: (h): VNode => h(App),
}).$mount('#app');
