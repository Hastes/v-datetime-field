# Vuetify plugin VDatetimeField

<p align="center">
  <a href="https://npmcharts.com/compare/v-datetime-field?minimal=true">
    <img src="http://img.shields.io/npm/dm/v-datetime-field.svg">
  </a>
  <a href="https://www.npmjs.org/package/v-datetime-field">
    <img src="https://img.shields.io/npm/v/v-datetime-field.svg">
  </a>
  <a href="http://img.badgesize.io/https://unpkg.com/v-datetime-field/lib/v-datetime-field.umd.js?compression=gzip&label=gzip">
    <img src="http://img.badgesize.io/https://unpkg.com/v-datetime-field/lib/v-datetime-field.umd.js?compression=gzip&label=gzip">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

**Vuetify datetime picker with input fields** 📅

<p align="center">
<img width="600px" src="https://s10.gifyu.com/images/ezgif.com-gif-maker80d71365df2e0ced.gif"/>
</p>

# Features

### VDatetimeField

* **Input** - You can input date and time via keyboard
* **Use separately** - You can use only datepicker or only timepicker 
* **Masked** - Time and date input masked


# Requirements
* Vuetify 2.x
* Vue 2.x

# Installation

### Install package
```shell
npm install --save v-datetime-field
```
or
```shell
yarn add v-datetime-field
```

### Local
`component.vue`
```vue
<script>
import { VDatetimeField } from 'v-datetime-field'

export default {
  components: { VDatetimeField },
}
</script>
```

### Global
`main.js`
```javascript
import Vue from 'vue'
import VDatetimeField from 'v-datetime-field'

Vue.use(VDatetimeField)
```

`main.js`
```html
<v-datetime-field
  v-model="formData['date']"
  :menu-props="{ top: true }"
  :date-props="{ outlined: true, label: 'Date' }"
  :error-messages="errors"
/>
```

# Props

| Name           | Type       | Default        | Required | Description                   |
| -------------- | ---------- | -------------- | -------- | ----------------------------- |
| date-props     | `object`   | {}             | --       | Properties for date text input|
| time-props     | `object`   | {}             | --       | Properties for time text input|
| menu-props     | `object`   | {}             | --       | Properties for v-menu         |
| only-date      | `boolean`  | `False`        | --       | Use only datepicker           |
| only-time      | `boolean`  | `False`        | --       | Use only timepicker           |


## Roadmap
1. Add i18n

Welcome to contribute!

# License

MIT © Komarov Roman

