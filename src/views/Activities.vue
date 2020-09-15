<template lang="pug">
  .activities.main
    .filter-control(:class="{'active': mobileNavOpen}")
      .filter.text-input
        input(type="text" v-model="search"  placeholder="search by name...")
        button.clear(v-if="search !== ''" @click="search = undefined")

      .filter.checkbox
        input(type="checkbox" v-model="status" id="open")
        label.open(:class="{'chip': status}" for="open") open places only

      .filter.checkbox
        input(type="checkbox" v-model="yoga" id="yoga")
        label.yoga(:class="{'chip': yoga}" for="yoga") yoga

      .filter.checkbox
        input(type="checkbox" v-model="freediving" id="freediving")
        label.freediving(:class="{'chip': freediving}" for="freediving") freediving

      .filter.checkbox
        input(type="checkbox" v-model="scubaDiving" id="scubaDiving")
        label.scuba-diving(:class="{'chip': scubaDiving}" for="scubaDiving") scuba diving

      .filter.checkbox
        input(type="checkbox" v-model="surf" id="surf")
        label.surf(:class="{'chip': surf}" for="surf") surf

      .filter.checkbox
        input(type="checkbox" v-model="snorkeling" id="snorkeling")
        label.snorkeling(:class="{'chip': snorkeling}" for="snorkeling") snorkeling

      //- .filter.checkbox
      //-   input(type="checkbox" v-model="fishing" id="fishing")
      //-   label(for="fishing")

      .filter.checkbox
        input(type="checkbox" v-model="tour" id="tour")
        label.tour(:class="{'chip': tour}" for="tour") tour

      .count(v-if="!loading") {{ filteredActivities.length }} results

    isotope.tile-list.activities-list(
      v-if="!loading"
      :list="filteredActivities"
      :options="isotopeOptions"
      ref="isotope"
    )
      .tile.activity(
        v-for="(place, index) in filteredActivities"
        :class="{'open': place.isOpen, 'double': isDouble === index, 'reservation' : place.reservation,'warn': (place.opensIn !== null && place.opensIn >= 0) || (place.closesIn !== null && place.closesIn >= 1) }"
        :key="`place-${index}`"
      )
        .content(@click="toggleDouble(index)")
          h2.name {{ place.name }}

          .weekdays(v-if="!place.reservation")
            .wd(v-for="(weekday, wid) in place.openingHours" :class="{'closed': typeof weekday === 'string' || weekday[0].start === '', 'today' : wid === today}")
              div.day-names {{ weekArray[wid] }}
              span(v-if="typeof weekday === 'object' && weekday[0].start !== ''")
                div.interval(v-for="time in weekday")
                  | {{ time.start }}-{{ time.end }}

              span(v-else).closed-icon-text
                .icon
                .text Closed today

          .info
            span.chip.yoga(v-if="place.yoga") yoga
            span.chip.freediving(v-if="place.freediving") freediving
            span.chip.scuba-diving(v-if="place.scubaDiving") scuba diving
            span.chip.surf(v-if="place.surf") surf
            span.chip.snorkeling(v-if="place.snorkeling") snorkeling
            span.chip.fishing(v-if="place.fishing") fishing
            span.chip.mini-golf(v-if="place.miniGolf") mini golf
            span.chip.tour(v-if="place.tour") tour

        .footer(:class="{'reservation': place.reservation}")
          .status
            span(v-if="place.opensIn !== null") Opens in:&nbsp;
              strong {{ place.opensIn + 1 }}m
            span(v-if="place.closesIn !== null") Closes in:&nbsp;
              strong {{ place.closesIn + 1 }}m
            span(v-if="place.reservation") Contact for details

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
    ...mapState(["activities"]),
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
    filteredActivities() {
      return this.activities
        .filter(place => place.active === true)
        .filter(place =>
          this.status
            ? (place.isOpen || place.reservation) === this.status
            : true
        )
        .filter(place => (this.yoga ? place.yoga === this.yoga : true))
        .filter(place =>
          this.freediving ? place.freediving === this.freediving : true
        )
        .filter(place =>
          this.scubaDiving ? place.scubaDiving === this.scubaDiving : true
        )
        .filter(place => (this.surf ? place.surf === this.surf : true))
        .filter(place =>
          this.snorkeling ? place.snorkeling === this.snorkeling : true
        )
        .filter(place => (this.fishing ? place.fishing === this.fishing : true))
        .filter(place => (this.tour ? place.tour === this.tour : true))
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
    yoga: {
      get() {
        return this.tags ? this.tags.includes("yoga") : false;
      },
      set(val) {
        this.setQuery("yoga", val);
      }
    },
    freediving: {
      get() {
        return this.tags ? this.tags.includes("freediving") : false;
      },
      set(val) {
        this.setQuery("freediving", val);
      }
    },
    scubaDiving: {
      get() {
        return this.tags ? this.tags.includes("scubaDiving") : false;
      },
      set(val) {
        this.setQuery("scubaDiving", val);
      }
    },
    surf: {
      get() {
        return this.tags ? this.tags.includes("surf") : false;
      },
      set(val) {
        this.setQuery("surf", val);
      }
    },
    snorkeling: {
      get() {
        return this.tags ? this.tags.includes("snorkeling") : false;
      },
      set(val) {
        this.setQuery("snorkeling", val);
      }
    },
    fishing: {
      get() {
        return this.tags ? this.tags.includes("fishing") : false;
      },
      set(val) {
        this.setQuery("fishing", val);
      }
    },
    tour: {
      get() {
        return this.tags ? this.tags.includes("tour") : false;
      },
      set(val) {
        this.setQuery("tour", val);
      }
    }
  },
  created() {
    this.$store.dispatch("fetchCollection", "activities");

    if (window.innerWidth < 576)
      this.columnWidth = (window.innerWidth - 30) / 2;
  },
  methods: {
    setIsOpen() {
      this.activities.forEach(place => {
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
      this.$store.commit("toggleLoading", false);
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
    activities(val) {
      if (val.length) {
        this.setIsOpen();
      }
    }
  }
};
</script>
