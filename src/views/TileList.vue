<template lang="pug">
  .food-and-drink.main

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

      .count(v-if="!loading") {{ filteredCollection.length }} results

    isotope.tile-list(
      v-if="!loading"
      :list="filteredCollection"
      :options="isotopeOptions"
      ref="isotope"
    )
      tile(
        v-for="(item, index) in filteredCollection"
        :item="item"
        :key="`item-${index}`"
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
import {
  isWithinInterval,
  parse,
  differenceInSeconds,
  differenceInDays
} from "date-fns";

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
      init: true
    };
  },
  computed: {
    ...mapState([
      "filters",
      "collections",
      "timestamp",
      "today",
      "loading",
      "mobileNavOpen",
      "columnWidth"
    ]),
    collection() {
      return this.collections[this.$route.meta.collection];
    },
    filterObject() {
      const filterProps = this.$route.meta.filterProps;
      const obj = {
        ...{ openNow: false },
        ...filterProps.reduce((o, key) => ({ ...o, [key]: false }), {})
      };
      return obj;
    },
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
    filteredCollection() {
      const filterEntries = Object.entries(this.filters);

      return this.collection

        .filter(item => item.active === true)
        .filter(item =>
          this.search
            ? item.name.toLowerCase().includes(this.search.toLowerCase())
            : true
        )
        .filter((item, index) => {
          const boolArr = filterEntries.map(([filterKey, filterValue]) => {
            if (filterKey === "noPreorder") {
              return filterValue ? item.preorder !== filterValue : true;
            } else {
              return filterValue ? item[filterKey] === filterValue : true;
            }
          });
          return boolArr.every(filter => filter === true);
        })
        .sort((a, b) => {
          if (a.createdDate) {
            a.new =
              differenceInDays(this.timestamp, new Date(a.createdDate)) < 3;
          }
          return a.createdDate && a.new ? -1 : 0;
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch("fetchCollection", to.meta.collection).then(() => {
      next(vm => {
        vm.init = true;
        vm.setFilters(vm.filterObject);
        vm.setOpenNow();
      });
    });
  },
  methods: {
    ...mapActions(["toggleMobileNav", "setFilters", "setFilter"]),
    setOpenNow() {
      let startTime, endTime;
      let startTimeDiff, endTimeDiff;

      this.collection.forEach((item, index) => {
        this.$set(this.collection[index], "openNow", item.reservation || false);
        this.$set(this.collection[index], "opensIn", null);
        this.$set(this.collection[index], "closesIn", null);

        item.openingHours[this.today].forEach(element => {
          if (element.start && element.end) {
            startTime = this.parseTime(element.start);
            endTime = this.parseTime(element.end);

            startTimeDiff = differenceInSeconds(startTime, this.timestamp);
            endTimeDiff = differenceInSeconds(endTime, this.timestamp);

            if (
              element.start &&
              isWithinInterval(this.timestamp, {
                start: startTime,
                end: endTime
              })
            ) {
              item.openNow = true;
            }

            if (startTimeDiff < 1800 && startTimeDiff > 0) {
              item.opensIn = Math.ceil(startTimeDiff / 60);
            }

            if (endTimeDiff < 1800 && endTimeDiff > 0) {
              item.closesIn = Math.ceil(endTimeDiff / 60);
            }
          }
        });
      });
      if (this.init) {
        this.arrange();
        this.init = false;
      }
    },
    parseTime(time) {
      return parse(time, "HH:mm", new Date());
    }
  },
  watch: {
    timestamp() {
      this.setOpenNow();
    }
  }
};
</script>
