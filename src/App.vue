<template lang="pug">
  v-app
    v-main
      v-container
        h1 v-datatime
        v-datatime.mt-7(
          v-model="date"
          only-date
          solo
          outlined
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
