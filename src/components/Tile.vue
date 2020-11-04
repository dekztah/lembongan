<template lang="pug">
  .tile(
    :class="{'open': openNow, 'double': isDouble, 'reservation' : item.reservation, 'warn': (item.opensIn !== null && item.opensIn >= 0) || (item.closesIn !== null && item.closesIn >= 1), 'new': item.new}"
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
        span(v-if="item.opensIn !== null") Opens in:&nbsp;
          strong {{ item.opensIn }}m
        span(v-if="item.closesIn !== null") Closes in:&nbsp;
          strong {{ item.closesIn }}m
        span(v-if="item.reservation") Contact for details

      a.social.maps(v-if="item.gMapsLink" :href="item.gMapsLink" target="_blank" rel="noopener")
      a.social.fb(v-if="item.facebookLink" :href="item.facebookLink" target="_blank" rel="noopener")
      a.social.insta(v-if="item.instagramLink" :href="item.instagramLink" target="_blank" rel="noopener")
      a.social.wa(v-if="item.contact" :href="waUrl(item.contact)" target="_blank" rel="noopener")

    .highlight(v-if="item.new") NEW

</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import chip from "@/components/Chip";
import { isWithinInterval, parse, differenceInSeconds } from "date-fns";

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
  computed: {
    ...mapState(["filters", "weekArray", "today"]),
    ...mapGetters(["timestamp"]),
    openNow() {
      return this.item.openingHours[this.today].find(element => {
        this.item.opensIn = null;
        this.item.closesIn = null;

        if (element.start && element.end) {
          startTime = this.parseTime(element.start);
          endTime = this.parseTime(element.end);

          startTimeDiff = differenceInSeconds(startTime, this.timestamp);
          endTimeDiff = differenceInSeconds(endTime, this.timestamp);

          if (startTimeDiff < 1800 && startTimeDiff > 0) {
            this.item.opensIn = Math.ceil(startTimeDiff / 60);
          }

          if (endTimeDiff < 1800 && endTimeDiff > 0) {
            this.item.closesIn = Math.ceil(endTimeDiff / 60);
          }

          return (this.item.openNow = isWithinInterval(this.timestamp, {
            start: startTime,
            end: endTime
          }));
        }
      });
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
    },
    parseTime(time) {
      return parse(time, "HH:mm", new Date());
    }
  }
};
</script>
