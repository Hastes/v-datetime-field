import Vue from 'vue';
import { VueConstructor } from 'vue/types';
import {
  VDatePicker,
  VTimePicker,
  VMenu,
  VBtn,
  VSpacer,
  VTextField,
  VInput,
} from 'vuetify/lib';

import DatetimeField from './VDatetimeField/index.vue';

Vue.component('VBtn', VBtn);
Vue.component('VMenu', VMenu);
Vue.component('VTimePicker', VTimePicker);
Vue.component('VDatePicker', VDatePicker);
Vue.component('VTextField', VTextField);
Vue.component('VSpacer', VSpacer);
Vue.component('VInput', VInput);

class VDatetimeFieldPlugin {
  public install(Vue: VueConstructor): void {
    Vue.component('VDatetimeField', DatetimeField);
  }
}

export const VDatetimeField = DatetimeField;

export default new VDatetimeFieldPlugin();
