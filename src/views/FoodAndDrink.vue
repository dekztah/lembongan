<template lang="pug">
  .food-and-drink.main

    .filter-control(:class="{'active': mobileNavOpen}")
      .filter.text-input
        input(type="text" v-model="search"  placeholder="search by name...")
        button.clear(v-if="search !== ''" @click="search = undefined")

      .filter.checkbox
        input(type="checkbox" v-model="status" id="open")
        label(for="open")
        .text open places only

      .filter.checkbox
        input(type="checkbox" v-model="dineIn" id="dineIn")
        label(for="dineIn")
        .text dine-in only

      .filter.checkbox
        input(type="checkbox" v-model="delivery" id="delivery")
        label(for="delivery")
        .text delivery only

      .filter.checkbox
        input(type="checkbox" v-model="noPreorder" id="noPreorder")
        label(for="noPreorder")
        .text no preorder

      .filter.checkbox
        input(type="checkbox" v-model="localDishes" id="localDishes")
        label(for="localDishes")
        .text local dishes

      .filter.checkbox
        input(type="checkbox" v-model="coffee" id="coffee")
        label(for="coffee")
        .text coffee

      .filter.checkbox
        input(type="checkbox" v-model="rendang" id="rendang")
        label(for="rendang")
        .text rendang

      .filter.checkbox
        input(type="checkbox" v-model="drinks" id="drinks")
        label(for="drinks")
        .text drinks

      .count(v-if="!loading") {{ filteredPlaces.length }} results

    isotope.tile-list.places-list(
      v-if="!loading"
      :list="filteredPlaces"
      :options="isotopeOptions"
      ref="isotope"
    )
      .tile.place(
        v-for="(place, index) in filteredPlaces"
        :class="{'open': place.isOpen, 'double': isDouble === index, 'warn': (place.opensIn !== null && place.opensIn >= 0) || (place.closesIn !== null && place.closesIn >= 1) }"
        :key="`place-${index}`"
      )
        .content(@click="toggleDouble(index)")
          h2.name {{ place.name }}

          .weekdays
            .wd(v-for="(weekday, wid) in place.openingHours" :class="{'closed': typeof weekday === 'string', 'today' : wid === today}")
              div.day-names {{ weekArray[wid] }}
              span(v-if="typeof weekday === 'object' && weekday[0].start !== ''")
                div.interval(v-for="time in weekday")
                  | {{ time.start }}-{{ time.end }}

              span(v-else).closed-icon-text
                .icon
                .text Closed today

          .info
            span.chip.dine-in(v-if="place.dineIn") dine-in
            span.chip.preorder(v-if="place.preorder") preorder
            span.chip.delivery(v-if="place.delivery") delivery
            span.chip.local-dishes(v-if="place.localDishes") local dishes
            span.chip.coffee(v-if="place.coffee") coffee
            span.chip.rendang(v-if="place.rendang") rendang
            span.chip.drinks(v-if="place.drinks") drinks

        .footer
          .status
            span(v-if="place.opensIn !== null") Opens in:&nbsp;
              strong {{ place.opensIn + 1 }}m
            span(v-if="place.closesIn !== null") Closes in:&nbsp;
              strong {{ place.closesIn + 1 }}m

          a.maps(v-if="place.gMapsLink" :href="place.gMapsLink" target="_blank")
          a.fb(v-if="place.facebookLink" :href="place.facebookLink" target="_blank")
          a.insta(v-if="place.instagramLink" :href="place.instagramLink" target="_blank")
          a.wa(v-if="place.contact" :href="waUrl(place.contact)" target="_blank")

</template>

<script>
import { mapState } from "vuex";
import isotope from "vueisotope";

export default {
  components: {
    isotope
  },
  props: {
    tags: Array,
    q: String,
    open: String
  },
  data() {
    return {
      isDouble: false,
      columnWidth: 180
    };
  },
  computed: {
    ...mapState(["places"]),
    loading() {
      return this.$store.state.loading;
    },
    mobileNavOpen() {
      return this.$store.state.mobileNavOpen;
    },
    timestamp() {
      return this.$store.state.timestamp;
    },
    weekArray() {
      return this.$store.state.weekArray;
    },
    today() {
      return this.$store.state.timestamp.isoWeekday() - 1;
    },
    isotopeOptions() {
      return {
        transitionDuration: "0.3s",
        layoutMode: "masonry",
        masonry: {
          columnWidth: this.columnWidth,
          gutter: 10
        }
      };
    },
    filteredPlaces() {
      return this.places
        .filter(place => place.active === true)
        .filter(place => (this.status ? place.isOpen === this.status : true))
        .filter(place => (this.dineIn ? place.dineIn === this.dineIn : true))
        .filter(place =>
          this.delivery ? place.delivery === this.delivery : true
        )
        .filter(place =>
          this.noPreorder ? place.preorder !== this.noPreorder : true
        )
        .filter(place =>
          this.localDishes ? place.localDishes === this.localDishes : true
        )
        .filter(place => (this.coffee ? place.coffee === this.coffee : true))
        .filter(place => (this.rendang ? place.rendang === this.rendang : true))
        .filter(place => (this.drinks ? place.drinks === this.drinks : true))
        .filter(place =>
          this.search
            ? place.name.toLowerCase().includes(this.search.toLowerCase())
            : true
        );
    },
    status: {
      get() {
        return this.open == "true";
      },
      set(val) {
        if (!val) val = undefined;
        this.$router.replace({
          query: { q: this.q, tags: this.tags, open: val }
        });
      }
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
    },
    dineIn: {
      get() {
        return this.tags ? this.tags.includes("dineIn") : false;
      },
      set(val) {
        this.setQuery("dineIn", val);
      }
    },
    delivery: {
      get() {
        return this.tags ? this.tags.includes("delivery") : false;
      },
      set(val) {
        this.setQuery("delivery", val);
      }
    },
    noPreorder: {
      get() {
        return this.tags ? this.tags.includes("noPreorder") : false;
      },
      set(val) {
        this.setQuery("noPreorder", val);
      }
    },
    localDishes: {
      get() {
        return this.tags ? this.tags.includes("localDishes") : false;
      },
      set(val) {
        this.setQuery("localDishes", val);
      }
    },
    coffee: {
      get() {
        return this.tags ? this.tags.includes("coffee") : false;
      },
      set(val) {
        this.setQuery("coffee", val);
      }
    },
    rendang: {
      get() {
        return this.tags ? this.tags.includes("rendang") : false;
      },
      set(val) {
        this.setQuery("rendang", val);
      }
    },
    drinks: {
      get() {
        return this.tags ? this.tags.includes("drinks") : false;
      },
      set(val) {
        this.setQuery("drinks", val);
      }
    }
  },
  created() {
    this.$store.dispatch("fetchPlaces");

    if (window.innerWidth < 576)
      this.columnWidth = (window.innerWidth - 30) / 2;
  },
  methods: {
    setIsOpen() {
      this.places.forEach(place => {
        const today = this.today;
        const time = this.$moment(this.timestamp, "HH:mm");
        place.isOpen = false;
        place.opensIn = null;
        place.closesIn = null;

        if (typeof place.openingHours[today] === "object") {
          place.openingHours[today].forEach(element => {
            const startTime = this.$moment(element.start, "HH:mm");
            const endTime = this.$moment(element.end, "HH:mm");

            if (this.$moment(time, "HH:mm").isBetween(startTime, endTime)) {
              place.isOpen = true;
            }

            if (
              startTime.diff(time, "s") < 1800 &&
              startTime.diff(time, "s") >= 0
            ) {
              place.opensIn = startTime.diff(time, "m");
            }

            if (
              endTime.diff(time, "s") < 1800 &&
              endTime.diff(time, "s") >= 0
            ) {
              place.closesIn = endTime.diff(time, "m");
            }
          });
        }
      });
    },
    toggleDouble(index) {
      this.isDouble = this.isDouble === index ? null : index;
      this.$nextTick(() => {
        this.$refs.isotope.layout("masonry");
      });
      if (this.mobileNavOpen) this.$store.commit("toggleMobileNav");
    },
    setQuery(queryKey, val) {
      let queryPush = JSON.parse(JSON.stringify(this.$route.query));
      if (!queryPush.tags) queryPush.tags = [];

      if (val) {
        queryPush.tags.push(queryKey);
      } else {
        queryPush.tags.splice(this.tags.indexOf(queryKey), 1);
      }
      this.$router.push({ query: queryPush });
    },
    waUrl(contact) {
      return `https://wa.me/${contact}`;
    }
  },
  watch: {
    timestamp() {
      this.setIsOpen();
    },
    places(val) {
      if (val.length) {
        this.setIsOpen();
      }
    }
  }
};
</script>
