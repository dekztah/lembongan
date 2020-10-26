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
      tile.activity(
        v-for="(place, index) in filteredActivities"
        :place="place"
        :key="`place-${index}`"
        @arrange="arrange"
      )

</template>

<script>
import store from "@/store";
import { mapState, mapActions } from "vuex";
import isotope from "vueisotope";
import checkbox from "@/components/Checkbox";
import tile from "@/components/Tile";
import generic from "@/mixins/generic";

export default {
  components: {
    isotope,
    checkbox,
    tile
  },
  props: {
    tags: Array,
    q: String,
    open: String
  },
  mixins: [generic],
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
        this.arrange();
        this.init = false;
      }
    }
  },
  watch: {
    timestamp() {
      this.setopenNow();
    }
  }
};
</script>
