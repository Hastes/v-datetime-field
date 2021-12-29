import Vue from 'vue';
import { VNode } from 'vue/types';

import vuetify from './plugins/vuetify';
import VDatetimeField from '../plugin/index';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VDatetimeField);

new Vue({
  vuetify,
  render: (h): VNode => h(App),
}).$mount('#app');
