<template lang="pug">
  .tile(
    :class="{'open': item.openNow, 'double': isDouble, 'reservation' : item.reservation, 'warn': (item.opensIn !== null && item.opensIn >= 0) || (item.closesIn !== null && item.closesIn >= 1), 'new': item.new}"
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
        ) {{ key }}



    .footer(:class="{'reservation': item.reservation}")
      .status
        span(v-if="item.opensIn !== null") Opens in:&nbsp;
          strong {{ item.opensIn }}m
        span(v-if="item.closesIn !== null") Closes in:&nbsp;
          strong {{ item.closesIn }}m
        span(v-if="item.reservation") Contact for details

      a.social.maps(v-if="item.gMapsLink" :href="item.gMapsLink" target="_blank")
      a.social.fb(v-if="item.facebookLink" :href="item.facebookLink" target="_blank")
      a.social.insta(v-if="item.instagramLink" :href="item.instagramLink" target="_blank")
      a.social.wa(v-if="item.contact" :href="waUrl(item.contact)" target="_blank")

    .highlight(v-if="item.new") NEW

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
    item: Object
  },
  computed: {
    ...mapState(["filters", "weekArray", "today"])
  },
  methods: {
    toggleDouble() {
      this.isDouble = !this.isDouble;
      this.$emit("arrange");
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
