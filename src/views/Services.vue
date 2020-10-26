<template lang="pug">
  .services.main
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

      .count(v-if="!loading") {{ filteredServices.length }} results

    isotope.tile-list.services-list(
      v-if="!loading"
      :list="filteredServices"
      :options="isotopeOptions"
      ref="isotope"
    )
      tile.service(
        v-for="(place, index) in filteredServices"
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
        noPreorder: false,
        spa: false,
        barber: false,
        hairdresser: false,
        laundry: false,
        // tailor: false,
        handcraft: false,
        motorRepair: false
      }
    };
  },
  computed: {
    ...mapState([
      "filters",
      "services",
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
    filteredServices() {
      const filterKeys = Object.entries(this.filters);

      return this.services
        .filter(place => place.active === true)
        .filter(place =>
          this.search
            ? place.name.toLowerCase().includes(this.search.toLowerCase())
            : true
        )
        .filter((place, index) => {
          const boolArr = filterKeys.map(key => {
            if (key[0] === "noPreorder") {
              return key[1] ? place.preorder !== key[1] : true;
            } else {
              return key[1] ? place[key[0]] === key[1] : true;
            }
          });
          return boolArr.every(f => f === true);
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch("fetchCollection", "services").then(() => {
      next(vm => {
        vm.setFilters(vm.filterArray);
        vm.setOpenNow();
      });
    });
  },
  methods: {
    ...mapActions(["toggleMobileNav", "setFilters", "setFilter"]),
    setOpenNow() {
      const today = this.today;
      const time = this.$moment(this.timestamp, "HH:mm");

      this.services.forEach((place, index) => {
        this.$set(this.services[index], "openNow", place.reservation || false);
        this.$set(this.services[index], "opensIn", null);
        this.$set(this.services[index], "closesIn", null);

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
      this.setOpenNow();
    }
  }
};
</script>
