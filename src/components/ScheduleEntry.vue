<template lang="pug">
  .boat(:class="{'has-left': !available, 'noop': !operating, 'warn': leavingSoon}")
    .content
      h2.time(@click="calOpen = !calOpen") {{ entry.departure }} {{ entry.name }}
      span.location(v-if="dest === 'departToSanur'") from {{ entry.lembonganLocation }}
      span.location(v-if="dest === 'departToLembongan'") to {{ entry.lembonganLocation }}
      .cal-wrapper(v-show="calOpen")
        flat-pickr(v-model="entry.opDays" :config="config")

    .footer
      .status
        .not-operating(v-if="!operating") Not operating today
        span(v-if="leavingIn") departs in:&nbsp;
          strong {{ leavingIn }}
        span(v-if="!available") already left


      a.social.maps(v-if="entry.gMapsLink" :href="entry.gMapsLink" target="_blank" rel="noopener")
      a.social.wa(v-if="entry.contact" :href="waUrl(entry.contact)" target="_blank" rel="noopener") WA

</template>
<script>
import flatPickr from "vue-flatpickr-component";
import { mapState, mapActions, mapGetters } from "vuex";
import {
  differenceInSeconds,
  format,
  parse,
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
  data() {
    return {
      calOpen: false,
      config: {
        mode: "multiple",
        inline: true,
        locale: {
          firstDayOfWeek: 1
        }
      }
    };
  },
  computed: {
    ...mapState(["loading", "mobileNavOpen", "weekArray", "today"]),
    ...mapGetters(["timestamp"]),
    leaveTime() {
      return this.parseTime(this.entry.departure);
    },
    operating() {
      if (!this.entry.activeDates) return false;

      let formattedDate = format(this.timestamp, "yyyy-MM-dd");
      let dates = this.entry.activeDates.split(", ");

      return dates.includes(formattedDate);
    },
    timeDiff() {
      return differenceInSeconds(this.leaveTime, this.timestamp);
    },
    available() {
      return this.operating && this.timeDiff >= 0;
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
    },
    parseTime(time) {
      return parse(time, "HH:mm", new Date());
    }
  }
};
</script>
