<template lang="pug">
  v-input.v-datetime-field(
    v-bind="commonAttrs"
    :error-count="commonAttrs['error-messages'].length"
    :value="outputValue"
  )
    .v-datetime-field__wrapper
      .v-datetime-field__date(v-if="!onlyTime")
        v-menu(
          v-model="date.menu"
          v-bind="mixedMenuProps"
        )
          template(v-slot:activator="{ on }")
            v-slot(name="dateFieldLabel")
            v-text-field(
              v-model="date.textField"
              v-bind="dateAttrs"
              v-on="on"
              type="text"
              v-mask="'##.##.####'"
              @click:clear="date.textField = null"
              @focus.stop.prevent="openDate"
            )
          v-date-picker.included(
            v-model="date.picker"
            v-bind="datePickerProps"
            :min="formatMinMaxDate(datePickerProps.min)"
            :max="formatMinMaxDate(datePickerProps.max)"
            no-title
            scrollable
            @input="date.menu = false"
          )
            v-spacer
            v-btn(text :color="buttonColor" @click="date.menu = false") Отмена

      .v-datetime-field__time(v-if="!onlyDate")
        v-menu(
          v-model="time.menu"
          v-bind="mixedMenuProps"
        )
          template(v-slot:activator="{ on }")
            v-slot(name="timeFieldLabel")
            v-text-field(
              ref="timePickerInput"
              v-model="time.textField"
              v-bind="timeAttrs"
              v-on="on"
              type="text"
              v-mask="'##:##'"
              @click:clear="time.textField = null"
              @focus.stop.prevent="openTime"
            )
          v-time-picker.included(
            v-bind="timePickerProps"
            :value="time.picker.value"
            format="24hr"
            @change="setTimePickerValue"
            @click:hour="setTimePickerValue"
          )
            v-spacer
            v-btn(text :color="buttonColor" @click="time.menu = false") Отмена

    template(
      v-for="(_, name) in $scopedSlots"
      v-slot:[name]="data"
    )
      slot(:name="name" v-bind="data")
</template>

<script>
import { format, parse } from 'date-fns';
import { mask } from 'vue-the-mask';

const DEFAULT_FORMAT_DATE = 'dd.MM.yyyy';

const DEFAULT_MENU_PROPS = {
  'min-width': 290,
  'offset-y': true,
  'close-on-content-click': false,
  transition: 'scale-transition',
};

export default {
  name: 'DatePicker',
  directives: {
    mask,
  },
  props: {
    value: { type: [String, Date], default: null },

    onlyDate: { type: Boolean, default: false },
    onlyTime: { type: Boolean, default: false },

    dateProps: { type: Object, default: () => ({}) },
    timeProps: { type: Object, default: () => ({}) },
    datePickerProps: { type: Object, default: () => ({}) },
    timePickerProps: { type: Object, default: () => ({}) },
    menuProps: { type: Object, default: () => ({}) },

    buttonColor: { type: String, default: 'primary' },
  },
  data() {
    return {
      date: {
        menu: false,
        textField: null,
        picker: null,
        validate: {
          rule: (v) =>
            /(0[1-9]|[12]\d|3[01]).(0[1-9]|1[0-2]).([12][0-9]{3})/.test(v),
          success: true,
        },
      },

      time: {
        menu: false,
        textField: null,
        picker: {
          value: null,
          fullfilled: false,
        },
        validate: {
          rule: (v) => /([0-1]\d|2[0-3]):[0-5][0-9]/.test(v),
          success: true,
        },
      },

      dateAttrs: {
        appendIcon: 'mdi-calendar',
        placeholder: '__.__.____',
        hideDetails: true,
        ...this.dateProps,
      },
      timeAttrs: {
        appendIcon: 'mdi-clock',
        placeholder: '__:__',
        hideDetails: true,
        ...this.timeProps,
      }
    };
  },
  computed: {
    mixedMenuProps() {
      return { ...DEFAULT_MENU_PROPS, ...this.menuProps };
    },
    outputValue() {
      const [date, time] = [this.date.picker, this.time.picker.value];

      if (!this.onlyDate && !this.onlyTime) {
        return date && time ? [date, time].join(' ').trim() : '';
      }
      return [date, time].join(' ').trim() || null;
    },
    commonAttrs() {
      const { $attrs } = this || {};
      const localDatetimeErrors = [];
      if (!this.date.validate.success) localDatetimeErrors.push('Дата введена неверно');
      if (!this.time.validate.success) localDatetimeErrors.push('Время введено неверно');
      return {
        ...$attrs,
        'error-messages': [
          ...($attrs['error-messages'] || []),
          ...localDatetimeErrors,
        ],
      };
    },
  },
  watch: {
    // Value watchers
    value: {
      handler(val) {
        let datetime = [null, null];

        if (val) {
          if (typeof val === 'string') datetime = val.split(' ');
          else {
            datetime = new Date(val).toLocaleString().split(', ');
            datetime[0] = this.setDate(datetime[0]);
          }
        }

        const [date, time] = datetime;

        this.date.picker = date;
        this.time.picker = { value: time, fullfilled: !val };
      },
      immediate: true,
    },
    outputValue() {
      this.emitValue();
    },

    // Date watchers
    'date.picker': {
      handler(val) {
        let date = null;

        if (val) date = format(new Date(val), DEFAULT_FORMAT_DATE);
        this.date.textField = date;
      },
      immediate: true,
    },
    'date.textField': {
      handler(val) {
        if ((val && val.length === 10) || !val) {
          this.date.validate.success = !val ? true : this.date.validate.rule(val);

          if (this.date.validate.success) {
            this.date.picker = val && this.setDate(val);
          } else {
            this.date.menu = false;
          }
        }
      },
    },

    // Time watchers
    'time.picker.value': {
      handler(val) {
        this.time.textField = val;
      },
      immediate: true,
    },
    'time.textField': {
      handler(val) {
        let valFormatted = null;

        if (val && val.length === 5) {
          valFormatted = val;
        }

        if (valFormatted) {
          this.time.validate.success = this.time.validate.rule(valFormatted);

          if (this.time.validate.success) {
            this.time.picker = {
              value: valFormatted,
              fullfilled: val.length === 5,
            };
          } else {
            this.time.menu = false;
          }
        }
        if (!val) {
          this.time.picker = {
            value: null,
            fullfilled: true,
          };
        }
      },
    },
  },
  mounted() {
    const { $el, emitValue, closeMenus } = this;

    $el.addEventListener('focusout', (event) => {
      // If focus is still in the input, do nothing
      const { relatedTarget } = event;

      if (!relatedTarget) emitValue();

      if (
        $el.contains(relatedTarget) ||
        relatedTarget.classList.contains('.included') ||
        relatedTarget.closest('.included')
      )
        return;

      closeMenus();
      emitValue();
    });
  },
  methods: {
    formatMinMaxDate(val) {
      return val ? format(val, 'yyyy-MM-dd') : undefined;
    },
    setDate(val) {
      return format(parse(val, DEFAULT_FORMAT_DATE, new Date()), 'yyyy-MM-dd');
    },
    setTimePickerValue(val) {
      if (typeof val == 'number') {
        this.setHours(val);
      } else {
        this.time.picker = {
          value: val,
          fullfilled: true,
        };
        this.time.menu = false;
      }
    },
    setHours(val) {
      const hours = val > 9 ? val : `0${val}`;

      if (this.time.textField) {
        const [, minutes] = this.time.textField.split(':');
        this.time.textField = `${hours}:${minutes}`;
      } else {
        this.time.textField = `${hours}:00`;
      }
    },
    openDate() {
      if (this.date.validate.success) {
        setTimeout(() => {
          this.date.menu = true;
          this.time.menu = false;
        }, 150);
      }
    },
    openTime() {
      if (this.time.validate.success) {
        setTimeout(() => {
          this.time.menu = true;
          this.date.menu = false;
        }, 150);
      }
    },
    closeMenus() {
      this.date.menu = false;
      this.time.menu = false;
    },
    emitValue() {
      this.$emit('input', this.outputValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-datetime-field {
  &.v-input ::v-deep {
    & > .v-input__control {
      & > .v-input__slot {
        display: block !important;
      }

      & > .v-messages {
        padding: 0 12px;
        margin-bottom: 8px;
      }
    }
  }

  &__wrapper {
    display: flex;
    margin-top: 4px;
    gap: 8px;
  }

  &__date {
    flex: 1;
  }

  &__time {
    ::v-deep .v-text-field input {
      max-width: 100px;
    }
  }
}
</style>
