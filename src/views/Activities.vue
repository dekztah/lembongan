<template lang="pug">
  .activities.main
    .filter-control(:class="{'active': mobileNavOpen}")
      .filter.text-input
        input(type="text" v-model="search"  placeholder="search by name...")
        button.clear(v-if="search !== ''" @click="search = undefined")

      checkbox(
        v-for="(cb, key) in filters"
        :key="`filter-${key}`"
        :name="key"
        :tags="tags"
        :open="open"
        @input="setQuery(key, $event)"
      )

      .count(v-if="!loading") {{ filteredActivities.length }} results

    isotope.tile-list.activities-list(
      v-if="!loading"
      :list="filteredActivities"
      :options="isotopeOptions"
      ref="isotope"
    )
      .tile.activity(
        v-for="(place, index) in filteredActivities"
        :class="{'open': place.openNow, 'double': isDouble === index, 'reservation' : place.reservation,'warn': (place.opensIn !== null && place.opensIn >= 0) || (place.closesIn !== null && place.closesIn >= 1) }"
        :key="`place-${index}`"
      )
        .content(@click="toggleDouble(index)")
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
import store from "@/store";
import { mapState, mapActions } from "vuex";
import isotope from "vueisotope";
import checkbox from "@/components/Checkbox";
import chip from "@/components/Chip";

export default {
  components: {
    isotope,
    checkbox,
    chip
  },
  props: {
    tags: Array,
    q: String,
    open: String
  },
  data() {
    return {
      isDouble: false,
      init: true,
      filterArray: {
        openNow: false,
        yoga: false,
        gym: false,
        freediving: false,
        scubaDiving: false,
        surf: false,
        snorkeling: false,
        tour: false
      }
    };
  },
  computed: {
    ...mapState([
      "filters",
      "activities",
      "loading",
      "mobileNavOpen",
      "timestamp",
      "weekArray",
      "today",
      "columnWidth"
    ]),
    isotopeOptions() {
      return {
        transitionDuration: "0.3s",
        layoutMode: "masonry",
        initLayout: false,
        masonry: {
          columnWidth: this.columnWidth,
          gutter: 10
        }
      };
    },
    filteredActivities() {
      const filterKeys = Object.entries(this.filters);

      return this.activities
        .filter(place => place.active === true)
        .filter(place =>
          this.search
            ? place.name.toLowerCase().includes(this.search.toLowerCase())
            : true
        )
        .filter((place, index) => {
          const boolArr = filterKeys.map(key => {
            return key[1] ? place[key[0]] === key[1] : true;
          });
          return boolArr.every(f => f === true);
        });
    },
    search: {
      get() {
        return this.q ? this.q : "";
      },
      set(val) {
        if (val === "") val = undefined;
        this.$router.replace({
          query: { q: val, tags: this.tags, open: this.status || undefined }
        });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch("fetchCollection", "activities").then(() => {
      next(vm => {
        vm.setFilters(vm.filterArray);
        vm.setopenNow();
      });
    });
  },
  methods: {
    ...mapActions(["toggleMobileNav", "setFilters", "setFilter"]),
    setopenNow() {
      const today = this.today;
      const time = this.$moment(this.timestamp, "HH:mm");

      this.activities.forEach((place, index) => {
        this.$set(
          this.activities[index],
          "openNow",
          place.reservation || false
        );
        this.$set(this.activities[index], "opensIn", null);
        this.$set(this.activities[index], "closesIn", null);

        place.openingHours[today].forEach(element => {
          const startTime = this.$moment(element.start, "HH:mm");
          const endTime = this.$moment(element.end, "HH:mm");

          if (time.isBetween(startTime, endTime)) {
            place.openNow = true;
          }

          if (
            startTime.diff(time, "s") < 1800 &&
            startTime.diff(time, "s") >= 0
          ) {
            place.opensIn = startTime.diff(time, "m");
          }

          if (endTime.diff(time, "s") < 1800 && endTime.diff(time, "s") >= 0) {
            place.closesIn = endTime.diff(time, "m");
          }
        });
      });
      if (this.init) {
        this.$nextTick(() => {
          this.$refs.isotope.arrange();
        });
        this.init = false;
      }
    },
    toggleDouble(index) {
      this.isDouble = this.isDouble === index ? null : index;
      this.$nextTick(() => {
        this.$refs.isotope.arrange();
      });
      if (this.mobileNavOpen) this.toggleMobileNav();
    },
    setQuery(key, val) {
      this.setFilter({ key, val });

      if (key === "openNow") {
        if (!val) val = undefined;
        this.$router.replace({
          query: { q: this.q, tags: this.tags, open: val }
        });
      } else {
        let queryPush = JSON.parse(JSON.stringify(this.$route.query));
        if (!queryPush.tags) queryPush.tags = [];

        if (val) {
          queryPush.tags.push(key);
        } else {
          queryPush.tags.splice(this.tags.indexOf(key), 1);
        }
        this.$router.push({ query: queryPush });
      }
    },
    chipVisible(place, key) {
      return place[key] && key !== "openNow";
    },
    waUrl(contact) {
      return `https://wa.me/${contact}`;
    }
  },
  watch: {
    timestamp() {
      this.setopenNow();
    }
  }
};
</script>
