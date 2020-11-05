<template lang="pug">
  .tile(
    :class="{'open': openNow, 'double': isDouble, 'reservation' : item.reservation, 'warn': (opensIn !== null && opensIn >= 0) || (closesIn !== null && closesIn >= 1), 'new': item.new}"
  )
    .content(@click="toggleDouble()")
      h2.name {{ item.name }}

      .weekdays(v-if="!item.reservation")
        .wd(v-for="(weekday, wid) in item.openingHours" :class="{'closed': weekday[0].start === '', 'today' : wid === today}")
          div.day-names {{ weekArray[wid] }}
          span(v-if="weekday[0].start !== ''")
            div.interval(v-for="time in weekday")
              | {{ time.start }}-{{ time.end }}

          span(v-else).closed-icon-text
            .icon
            .text Closed today

      .info
        chip(
          v-if="chipVisible(item, key)"
          v-for="(cb, key) in filters"
          :key="`chip-${key}`"
          :name="key"
        )

    .footer(:class="{'reservation': item.reservation}")
      .status
        span(v-if="opensIn !== null") Opens in:&nbsp;
          strong {{ opensIn }}m
        span(v-if="closesIn !== null") Closes in:&nbsp;
          strong {{ closesIn }}m
        span(v-if="item.reservation") Contact for details

      a.social.maps(v-if="item.gMapsLink" :href="item.gMapsLink" target="_blank" rel="noopener")
      a.social.fb(v-if="item.facebookLink" :href="item.facebookLink" target="_blank" rel="noopener")
      a.social.insta(v-if="item.instagramLink" :href="item.instagramLink" target="_blank" rel="noopener")
      a.social.wa(v-if="item.contact" :href="waUrl(item.contact)" target="_blank" rel="noopener")

    .highlight(v-if="item.new") NEW

</template>
<script>
import { mapState, mapGetters } from "vuex";
import chip from "@/components/Chip";
import generic from "@/mixins/generic";
import { isWithinInterval, differenceInSeconds } from "date-fns";

let startTime, endTime;
let startTimeDiff, endTimeDiff;

export default {
  data() {
    return {
      isDouble: false
    };
  },
  components: {
    chip
  },
  props: {
    item: Object
  },
  mixins: [generic],
  computed: {
    ...mapState(["filters", "weekArray", "today"]),
    ...mapGetters(["timestamp"]),

    openingHoursToday() {
      return this.item.openingHours[this.today];
    },
    openNow() {
      return this.openingHoursToday.find(element => {
        if (element.start && element.end) {
          startTime = this.parseTime(element.start);
          endTime = this.parseTime(element.end);

          return isWithinInterval(this.timestamp, {
            start: startTime,
            end: endTime
          });
        }
      });
    },
    opensIn() {
      let sec = null;

      this.openingHoursToday.find(element => {
        if (element.start && element.end) {
          startTime = this.parseTime(element.start);
          startTimeDiff = differenceInSeconds(startTime, this.timestamp);

          if (startTimeDiff < 1800 && startTimeDiff > 0) {
            sec = Math.ceil(startTimeDiff / 60);
          }
        }
      });
      return sec;
    },
    closesIn() {
      let sec = null;

      if (this.openNow) {
        endTime = this.parseTime(this.openNow.end);
        endTimeDiff = differenceInSeconds(endTime, this.timestamp);

        if (endTimeDiff < 1800 && endTimeDiff > 0) {
          sec = Math.ceil(endTimeDiff / 60);
        }
      }
      return sec;
    }
  },
  mounted() {
    if (this.item.reservation) {
      this.item.openNow = true;
    } else {
      this.item.openNow = typeof this.openNow === "object";
    }
  },
  methods: {
    toggleDouble() {
      this.isDouble = !this.isDouble;
    },
    chipVisible(item, key) {
      if (key === "noPreorder") key = "preorder";
      return item[key] && key !== "openNow";
    },
    waUrl(contact) {
      return `https://wa.me/${contact}`;
    }
  }
};
</script>
