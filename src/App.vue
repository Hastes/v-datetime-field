<template lang="pug">
  v-app
    v-main
      v-container
        h1 v-datetime-field
        v-datetime-field.mt-7(
          v-model="date"
          solo
          outlined
          :error-messages="['dsds']"
        )
</template>

<script>
export default {
  data() {
    return {
      date: null,
    };
  },
};
</script>
