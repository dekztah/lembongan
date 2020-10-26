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
      const filterKeys = Object.entries(this.filters);
      const collection = this.$route.meta.collection;

      return this.collection
        .filter(item => item.active === true)
        .filter(item =>
          this.search
            ? item.name.toLowerCase().includes(this.search.toLowerCase())
            : true
        )
        .filter((item, index) => {
          const boolArr = filterKeys.map(key => {
            if (key[0] === "noPreorder") {
              return key[1] ? item.preorder !== key[1] : true;
            } else {
              return key[1] ? item[key[0]] === key[1] : true;
            }
          });
          return boolArr.every(f => f === true);
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
      const today = this.today;
      const time = this.$moment(this.timestamp, "HH:mm");

      this.collection.forEach((item, index) => {
        this.$set(this.collection[index], "openNow", false);
        this.$set(this.collection[index], "opensIn", null);
        this.$set(this.collection[index], "closesIn", null);

        item.openingHours[today].forEach(element => {
          const startTime = this.$moment(element.start, "HH:mm");
          const endTime = this.$moment(element.end, "HH:mm");

          if (time.isBetween(startTime, endTime)) {
            item.openNow = true;
          }

          if (
            startTime.diff(time, "s") < 1800 &&
            startTime.diff(time, "s") >= 0
          ) {
            item.opensIn = startTime.diff(time, "m");
          }

          if (endTime.diff(time, "s") < 1800 && endTime.diff(time, "s") >= 0) {
            item.closesIn = endTime.diff(time, "m");
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
