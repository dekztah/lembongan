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

    transition-group.tile-list(
      tag="div"
      name="tile"
    )
      tile(
        v-for="item in filteredCollection"
        :item="item"
        :key="item.name"
      )

</template>

<script>
import store from "@/store";
import { mapState, mapActions, mapGetters } from "vuex";
import checkbox from "@/components/Checkbox";
import tile from "@/components/Tile";
import generic from "@/mixins/generic";
import { differenceInDays } from "date-fns";

export default {
  components: {
    checkbox,
    tile
  },
  props: {
    tags: Array,
    q: String,
    open: String
  },
  mixins: [generic],
  computed: {
    ...mapState([
      "filters",
      "collections",
      "today",
      "loading",
      "mobileNavOpen"
    ]),
    ...mapGetters(["timestamp"]),
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
        vm.setFilters(vm.filterObject);
      });
    });
  },
  methods: {
    ...mapActions(["toggleMobileNav", "setFilters", "setFilter"])
  }
};
</script>
