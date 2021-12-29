# Vuetify plugin VApiDatatable

<p align="center">
  <a href="https://npmcharts.com/compare/v-datetime?minimal=true">
    <img src="http://img.shields.io/npm/dm/v-datetime.svg">
  </a>
  <a href="https://www.npmjs.org/package/v-datetime">
    <img src="https://img.shields.io/npm/v/v-datetime.svg">
  </a>
  <a href="http://img.badgesize.io/https://unpkg.com/v-datetime/lib/v-datetime.umd.js?compression=gzip&label=gzip">
    <img src="http://img.badgesize.io/https://unpkg.com/v-datetime/lib/v-datetime.umd.js?compression=gzip&label=gzip">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

**Vuetify datetime picker with input fields** 📅

<p align="center">
<!-- <img width="600px" src="https://s10.gifyu.com/images/Screen-Recording-2021-12-06-at-12.58.11-1.gif"/> -->
</p>

# Features

### VApiDatatable

* **Input** - You can input date and time via keyboard
* **Use separately** - You can use only datepicker or only timepicker 
* **Masked** - Time and date input masked


# Requirements
* Vuetify 2.x
* Vue 2.x

# Installation

### Install package
```shell
npm install --save v-datetime
```
or
```shell
yarn add v-datetime
```

### Local
`component.vue`
```vue
<script>
import { VDatetimePicker } from 'v-datetime'

export default {
  components: { VDatetimePicker },
}
</script>
```

### Global
`main.js`
```javascript
import Vue from 'vue'
import VDatetimePicker from 'v-datetime'

Vue.use(VDatetimePicker)
```

# Props

| Name           | Type       | Default        | Required | Description                   |
| -------------- | ---------- | -------------- | -------- | ----------------------------- |
| label-date     | `string`   | Date           | --       | Label for text input date     |
| label-time     | `string`   | Time           | --       | Label for text input time     |
| only-date      | `boolean`  | `False`        | --       | Use only datepicker           |
| only-time      | `boolean`  | `False`        | --       | Use only timepicker           |



## Roadmap
1. Add i18n

Welcome to contribute!

# License

MIT © Komarov Roman

