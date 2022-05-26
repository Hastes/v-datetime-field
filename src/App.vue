<template lang="pug">
  v-app
    v-main
      v-container
        h1 v-datetime-field
        validation-observer(ref="obs")
          validation-provider(
            name="date"
            key="date"
            vid="date"
            rules="required"
            v-slot="{ errors }"
          )
            v-datetime-field.mt-7(
              v-model="formData['date']"
              outlined
              :error-messages="errors"
            )
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
};
</script>
