import Vue from 'vue';
import { VueConstructor } from 'vue/types';
import {
  VDatePicker,
  VTimePicker,
  VMenu,
  VBtn,
  VSpacer,
  VTextField,
} from 'vuetify/lib';

import DatetimePicker from './VDatetimePicker/index.vue';

Vue.component('VBtn', VBtn);
Vue.component('VMenu', VMenu);
Vue.component('VTimePicker', VTimePicker);
Vue.component('VDatePicker', VDatePicker);
Vue.component('VTextField', VTextField);
Vue.component('VSpacer', VSpacer);

class VDatetimePickerPlugin {
  public install(Vue: VueConstructor): void {
    Vue.component('VDatetimePicker', DatetimePicker);
  }
}

export const VDatetimePicker = DatetimePicker;

export default new VDatetimePickerPlugin();
