<template lang="pug">
  .tile(
    :class="{'open': place.openNow, 'double': isDouble, 'reservation' : place.reservation, 'warn': (place.opensIn !== null && place.opensIn >= 0) || (place.closesIn !== null && place.closesIn >= 1) }"
  )
    .content(@click="toggleDouble()")
      h2.name {{ place.name }}

      .weekdays(v-if="!place.reservation")
        .wd(v-for="(weekday, wid) in place.openingHours" :class="{'closed': weekday[0].start === '', 'today' : wid === today}")
          div.day-names {{ weekArray[wid] }}
          span(v-if="weekday[0].start !== ''")
            div.interval(v-for="time in weekday")
              | {{ time.start }}-{{ time.end }}

          span(v-else).closed-icon-text
            .icon
            .text Closed today

      .info
        chip(
          v-if="chipVisible(place, key)"
          v-for="(cb, key) in filters"
          :key="`chip-${key}`"
          :name="key"
        ) {{ key }}

    .footer(:class="{'reservation': place.reservation}")
      .status
        span(v-if="place.opensIn && place.opensIn !== null") Opens in:&nbsp;
          strong {{ place.opensIn + 1 }}m
        span(v-if="place.closesIn && place.closesIn !== null") Closes in:&nbsp;
          strong {{ place.closesIn + 1 }}m
        span(v-if="place.reservation") Contact for details

      a.maps(v-if="place.gMapsLink" :href="place.gMapsLink" target="_blank")
      a.fb(v-if="place.facebookLink" :href="place.facebookLink" target="_blank")
      a.insta(v-if="place.instagramLink" :href="place.instagramLink" target="_blank")
      a.wa(v-if="place.contact" :href="waUrl(place.contact)" target="_blank")

</template>
<script>
import { mapState, mapActions } from "vuex";
import chip from "@/components/Chip";

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
    place: Object
  },
  computed: {
    ...mapState(["filters", "weekArray", "today"])
  },
  methods: {
    toggleDouble() {
      this.isDouble = !this.isDouble;
      this.$emit("arrange");
    },
    chipVisible(place, key) {
      if (key === "noPreorder") key = "preorder";
      return place[key] && key !== "openNow";
    },
    waUrl(contact) {
      return `https://wa.me/${contact}`;
    }
  }
};
</script>
