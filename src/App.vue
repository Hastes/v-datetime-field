<template lang="pug">
  v-app
    v-main
      v-container
        h1 v-datetime-field
        div.mt-7
          validation-observer(ref="obs")
            validation-provider(
              name="text"
              key="text"
              vid="text"
              rules="required"
              v-slot="{ errors }"
            )
              v-text-field(
                v-model="formData['text']"
                label="Test Text"
                outlined
                :error-messages="errors"
              )
            validation-provider(
              name="date"
              key="date"
              vid="date"
              rules="required"
              v-slot="{ errors }"
            )
              v-datetime-field(
                v-model="formData['date']"
                outlined
                :error-messages="errors"
              )

            v-btn(
              color="primary"
              depressed
              @click="reset"
            ) Сбросить
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'Данное поле обязательно для заполнения',
});

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
