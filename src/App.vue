<template lang="pug">
  v-app
    v-main
      v-container(fill-height)
        div
          h1 v-datetime-field
          div.mt-7
            validation-observer(ref="obs" v-slot="{ invalid, dirty, validate }")
              validation-provider(
                name="date"
                key="date"
                vid="date"
                rules="required"
                v-slot="{ errors }"
              )
                v-datetime-field(
                  v-model="formData['date']"
                  :menu-props="{ top: true }"
                  :date-props="{ outlined: true }"
                  :error-messages="errors"
                  required
                )

                v-btn(
                  color="primary"
                  depressed
                  @click="reset"
                ) Сбросить
                v-btn(
                  color="success"
                  depressed
                  @click="validate"
                ) Проверить
                v-btn(
                  color="info"
                  depressed
                  :disabled="invalid && dirty"
                ) Отправить
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', required);

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      formData: {},
    };
  },
  methods: {
    reset() {
      this.formData = {};
      this.$refs.obs.reset();
    },
  },
};
</script>
