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
            slot(name="dateFieldLabel")
            v-text-field(
              ref="datePickerInput"
              v-model="date.textField"
              v-bind="extendDateProps"
              v-on="on"
              type="text"
              v-mask="'##.##.####'"
              @click:clear="date.textField = null"
              @focus.stop.prevent="openDate"
              @blur="onBlur"
            )
              template(v-for="name in dateField.scopedSlots" v-slot:[name]="data")
                slot(:name="`date-field.${name}`" v-bind="data")
              template(v-for="name in dateField.slots" :slot="name")
                slot(:name="`date-field.${name}`")

          v-date-picker.included(
            v-model="date.picker"
            v-bind="datePickerProps"
            :min="formatMinMaxDate(datePickerProps.min)"
            :max="formatMinMaxDate(datePickerProps.max)"
            no-title
            scrollable
            @input="date.menu = false"
            @mousedown.native.prevent
          )
            v-spacer
            v-btn(text :color="buttonColor" @click="date.menu = false") Закрыть

      .v-datetime-field__time(v-if="!onlyDate")
        v-menu(
          v-model="time.menu"
          v-bind="mixedMenuProps"
        )
          template(v-slot:activator="{ on }")
            slot(name="timeFieldLabel")
            v-text-field(
              ref="timePickerInput"
              v-model="time.textField"
              v-bind="extendTimeProps"
              v-on="on"
              type="text"
              v-mask="'##:##'"
              @click:clear="time.textField = null"
              @focus.stop.prevent="openTime"
              @blur="onBlur"
            )
              template(v-for="name in timeField.scopedSlots" v-slot:[name]="data")
                slot(:name="`time-field.${name}`" v-bind="data")
              template(v-for="name in timeField.slots" :slot="name")
                slot(:name="`time-field.${name}`")

          v-time-picker.included(
            v-bind="timePickerProps"
            :value="time.picker.value"
            :active-picker="!time.picker.value ? 'HOUR' : undefined"
            format="24hr"
            @change="setTimePickerValue"
            @click:hour="setTimePickerValue"
            @mousedown.native.prevent
          )
            v-spacer
            v-btn(text :color="buttonColor" @click="time.menu = false") Закрыть

    template(
      v-for="(_, name) in $scopedSlots"
      v-slot:[name]="data"
    )
      slot(:name="name" v-bind="data")
</template>

<script>
import { format, parse, max, min, parseISO } from 'date-fns';
import { mask } from 'vue-the-mask';

const DEFAULT_FORMAT_DATE = 'dd.MM.yyyy';

const DEFAULT_MENU_PROPS = {
  'min-width': 290,
  'offset-y': true,
  'close-on-content-click': false,
  transition: 'scale-transition',
  contentClass: 'included',
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

      extendDateProps: {
        appendIcon: 'mdi-calendar',
        placeholder: '__.__.____',
        hideDetails: true,
        ...this.dateProps,
      },
      extendTimeProps: {
        appendIcon: 'mdi-clock',
        placeholder: '__:__',
        hideDetails: true,
        ...this.timeProps,
      }
    };
  },
  computed: {
    dateField() {
      const { $scopedSlots, $slots } = this;
      return {
        scopedSlots: this.slotsGenerator('date-field', $scopedSlots),
        slots: this.slotsGenerator('date-field', $slots),
      };
    },
    timeField() {
      const { $scopedSlots, $slots } = this;
      return {
        scopedSlots: this.slotsGenerator('time-field', $scopedSlots),
        slots: this.slotsGenerator('time-field', $slots),
      };
    },
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

        if (this.outputValue === val) {
          this.date.picker = date || this.date.picker;
          this.time.picker = { value: time || this.time.picker.value, fullfilled: !val };
          return;
        }

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
            if (val) {
              // Применяем ограничения min/max для даты
              let clampedDate = this.clampDate(val);

              // Если значение было изменено из-за ограничений, обновляем textField
              if (clampedDate !== val) {
                this.date.textField = clampedDate;
              }

              // Если есть и дата, и время, проверяем комбинированное значение
              if (!this.onlyDate && this.time.picker?.value) {
                const clamped = this.clampDateTime(clampedDate, this.time.picker.value);
                if (clamped.date !== clampedDate || clamped.time !== this.time.picker.value) {
                  this.date.textField = clamped.date;
                  this.time.textField = clamped.time;
                  clampedDate = clamped.date;
                }
              }

              if (!this.time.picker?.value && !this.onlyDate) {
                this.$refs.timePickerInput?.focus?.();
              }

              this.date.picker = this.setDate(clampedDate);
            } else {
              this.date.picker = null;
            }
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
            // Применяем ограничения min/max для времени
            let clampedTime = this.clampTime(valFormatted);

            // Если значение было изменено из-за ограничений, обновляем textField
            if (clampedTime !== valFormatted) {
              this.time.textField = clampedTime;
              valFormatted = clampedTime;
            }

            // Если есть и дата, и время, проверяем комбинированное значение
            if (!this.onlyTime && this.date.picker) {
              const dateText = format(parse(this.date.picker, 'yyyy-MM-dd', new Date()), DEFAULT_FORMAT_DATE);
              const clamped = this.clampDateTime(dateText, clampedTime);
              if (clamped.date !== dateText || clamped.time !== clampedTime) {
                this.date.textField = clamped.date;
                this.time.textField = clamped.time;
                clampedTime = clamped.time;
              }
            }

            this.time.picker = {
              value: clampedTime,
              fullfilled: clampedTime.length === 5,
            };

            if (!this.date.picker && !this.onlyTime) {
              this.$refs.datePickerInput?.focus?.();
            }
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
  methods: {
    formatMinMaxDate(val) {
      return val ? format(new Date(val), 'yyyy-MM-dd') : undefined;
    },
    setDate(val) {
      return format(parse(val, DEFAULT_FORMAT_DATE, new Date()), 'yyyy-MM-dd');
    },
    clampDate(dateValue) {
      if (!dateValue) return dateValue;

      const { min: minDate, max: maxDate } = this.datePickerProps;
      if (!minDate && !maxDate) return dateValue;

      const parsedDate = parse(dateValue, DEFAULT_FORMAT_DATE, new Date());
      let clampedDate = parsedDate;

      if (minDate) {
        const minDateObj = typeof minDate === 'string' ? parseISO(minDate) : new Date(minDate);
        clampedDate = max([clampedDate, minDateObj]);
      }

      if (maxDate) {
        const maxDateObj = typeof maxDate === 'string' ? parseISO(maxDate) : new Date(maxDate);
        clampedDate = min([clampedDate, maxDateObj]);
      }

      return format(clampedDate, DEFAULT_FORMAT_DATE);
    },
    clampTime(timeValue) {
      if (!timeValue) return timeValue;

      const { min: minTime, max: maxTime } = this.timePickerProps;
      if (!minTime && !maxTime) return timeValue;

      const [hours, minutes] = timeValue.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes, 0, 0);

      let clampedTime = timeDate;

      if (minTime) {
        const [minHours, minMinutes] = minTime.split(':').map(Number);
        const minTimeDate = new Date();
        minTimeDate.setHours(minHours, minMinutes, 0, 0);
        clampedTime = max([clampedTime, minTimeDate]);
      }

      if (maxTime) {
        const [maxHours, maxMinutes] = maxTime.split(':').map(Number);
        const maxTimeDate = new Date();
        maxTimeDate.setHours(maxHours, maxMinutes, 0, 0);
        clampedTime = min([clampedTime, maxTimeDate]);
      }

      return format(clampedTime, 'HH:mm');
    },
    clampDateTime(dateValue, timeValue) {
      if (!dateValue || !timeValue) return { date: dateValue, time: timeValue };

      const { min: minDate, max: maxDate } = this.datePickerProps;
      const { min: minTime, max: maxTime } = this.timePickerProps;

      if (!minDate && !maxDate && !minTime && !maxTime) {
        return { date: dateValue, time: timeValue };
      }

      const parsedDate = parse(dateValue, DEFAULT_FORMAT_DATE, new Date());
      const [hours, minutes] = timeValue.split(':').map(Number);
      const datetime = new Date(parsedDate);
      datetime.setHours(hours, minutes, 0, 0);

      let clampedDatetime = datetime;

      if (minDate || minTime) {
        const minDateObj = minDate
          ? (typeof minDate === 'string' ? parseISO(minDate) : new Date(minDate))
          : parsedDate;

        if (minTime) {
          const [minHours, minMinutes] = minTime.split(':').map(Number);
          minDateObj.setHours(minHours, minMinutes, 0, 0);
        } else {
          minDateObj.setHours(0, 0, 0, 0);
        }

        clampedDatetime = max([clampedDatetime, minDateObj]);
      }

      if (maxDate || maxTime) {
        const maxDateObj = maxDate
          ? (typeof maxDate === 'string' ? parseISO(maxDate) : new Date(maxDate))
          : parsedDate;

        if (maxTime) {
          const [maxHours, maxMinutes] = maxTime.split(':').map(Number);
          maxDateObj.setHours(maxHours, maxMinutes, 0, 0);
        } else {
          maxDateObj.setHours(23, 59, 59, 999);
        }

        clampedDatetime = min([clampedDatetime, maxDateObj]);
      }

      return {
        date: format(clampedDatetime, DEFAULT_FORMAT_DATE),
        time: format(clampedDatetime, 'HH:mm'),
      };
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
    emitValue() {
      this.$emit('input', this.outputValue);
    },
    closeMenus() {
      this.date.menu = false;
      this.time.menu = false;
    },
    slotsGenerator(name, slots) {
      return Object.keys(slots)
        .map((key) => {
          if (key.startsWith(name)) {
            return key.split('.').at(-1);
          }
        })
        .filter(Boolean);
    },
    onBlur(e) {
      if (
        this.$el.contains(e.relatedTarget)
        && (
          (this.date.textField && !this.time.textField)
          || (this.time.textField && !this.date.textField)
        )
      ) {
        return;
      }

      this.emitValue();
      this.closeMenus();
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
