<template lang="pug">
  .boat(:class="{'has-left': !available, 'noop': !isOperatingToday, 'warn': leavingSoon}")
    .content
      h2.time(@click="calOpen = !calOpen") {{ entry.departure }} {{ entry.name }}
      span.location(v-if="dest === 'departToSanur'") from {{ entry.lembonganLocation }}
      span.location(v-if="dest === 'departToLembongan'") to {{ entry.lembonganLocation }}
      .cal-wrapper(v-show="calOpen")
        flat-pickr(v-model="operatingDates" :config="calendarConfig")

    .footer
      .status
        .not-operating(v-if="!isOperatingToday") Not operating today
        span(v-if="leavingIn") departs in:&nbsp;
          strong {{ leavingIn }}
        span(v-if="!available") already left

      a.social.maps(v-if="entry.gMapsLink" :href="entry.gMapsLink" target="_blank" rel="noopener")
      a.social.wa(v-if="entry.contact" :href="waUrl(entry.contact)" target="_blank" rel="noopener") WA

</template>
<script>
import flatPickr from "vue-flatpickr-component";
import { mapState, mapActions, mapGetters } from "vuex";
import generic from "@/mixins/generic";

import {
  differenceInSeconds,
  format,
  intervalToDuration,
  formatDuration
} from "date-fns";

export default {
  props: {
    entry: Object,
    dest: String
  },
  components: {
    flatPickr
  },
  mixins: [generic],
  data() {
    return {
      calOpen: false
    };
  },
  computed: {
    ...mapState(["loading", "mobileNavOpen", "weekArray", "today"]),
    ...mapGetters(["timestamp"]),
    calendarConfig() {
      return {
        mode: "multiple",
        inline: true,
        minDate: this.formattedDate,
        monthSelectorType: "static",
        locale: {
          firstDayOfWeek: 1
        }
      };
    },
    leaveTime() {
      return this.parseTime(this.entry.departure);
    },
    operatingDates() {
      if (!this.entry.activeDates) return false;

      return this.entry.activeDates.split(", ");
    },
    formattedDate() {
      return format(this.timestamp, "yyyy-MM-dd");
    },
    isOperatingToday() {
      if (!this.operatingDates) return false;

      return this.operatingDates.includes(this.formattedDate);
    },
    timeDiff() {
      return differenceInSeconds(this.leaveTime, this.timestamp);
    },
    available() {
      return this.isOperatingToday && this.timeDiff >= 0;
    },
    leavingSoon() {
      return this.timeDiff < 1800 && this.timeDiff >= 0;
    },
    leavingIn() {
      if (!this.available) return false;

      let duration = intervalToDuration({
        start: this.timestamp,
        end: this.leaveTime
      });

      return formatDuration(duration, {
        format: ["hours", "minutes"]
      });
    }
  },
  methods: {
    waUrl(contact) {
      return `https://wa.me/${contact}`;
    }
  }
};
</script>
