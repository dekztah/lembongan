<template lang="pug">
  .services.main
    .filter-control(:class="{'active': mobileNavOpen}")
      .filter.text-input
        input(type="text" v-model="search"  placeholder="search by name...")
        button.clear(v-if="search !== ''" @click="search = undefined")

      .filter.checkbox
        input(type="checkbox" v-model="status" id="open")
        label.open(:class="{'chip': status}" for="open") open places only

      .filter.checkbox
        input(type="checkbox" v-model="spa" id="spa")
        label.spa(:class="{'chip': spa}" for="spa") spa

      .filter.checkbox
        input(type="checkbox" v-model="barber" id="barber")
        label.barber(:class="{'chip': barber}" for="barber") barber

      .filter.checkbox
        input(type="checkbox" v-model="hairdresser" id="hairdresser")
        label.hairdresser(:class="{'chip': hairdresser}" for="hairdresser") hairdresser

      .filter.checkbox
        input(type="checkbox" v-model="tailor" id="tailor")
        label.tailor(:class="{'chip': tailor}" for="tailor") tailor

      .filter.checkbox
        input(type="checkbox" v-model="handcraft" id="handcraft")
        label.handcraft(:class="{'chip': handcraft}" for="handcraft") handcraft

      .count(v-if="!loading") {{ filteredServices.length }} results

    isotope.tile-list.services-list(
      v-if="!loading"
      :list="filteredServices"
      :options="isotopeOptions"
      ref="isotope"
    )
      .tile.service(
        v-for="(place, index) in filteredServices"
        :class="{'open': place.isOpen, 'double': isDouble === index, 'reservation' : place.reservation,'warn': (place.opensIn !== null && place.opensIn >= 0) || (place.closesIn !== null && place.closesIn >= 1) }"
        :key="`place-${index}`"
      )
        .content(@click="toggleDouble(index)")
          h2.name {{ place.name }}

          .weekdays(v-if="!place.reservation")
            .wd(v-for="(weekday, wid) in place.openingHours" :class="{'closed': typeof weekday === 'string', 'today' : wid === today}")
              div.day-names {{ weekArray[wid] }}
              span(v-if="typeof weekday === 'object' && weekday[0].start !== ''")
                div.interval(v-for="time in weekday")
                  | {{ time.start }}-{{ time.end }}

              span(v-else).closed-icon-text
                .icon
                .text Closed today

          .info
            span.chip.spa(v-if="place.spa") spa
            span.chip.barber(v-if="place.barber") barber
            span.chip.hairdresser(v-if="place.hairdresser") hairdresser
            span.chip.tailor(v-if="place.tailor") tailor
            span.chip.handcraft(v-if="place.handcraft") handcraft
            span.chip.preorder(v-if="place.preorder") preorder

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
    ...mapState(["services"]),
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
    filteredServices() {
      return this.services
        .filter(place => place.active === true)
        .filter(place =>
          this.status
            ? (place.isOpen || place.reservation) === this.status
            : true
        )
        .filter(place => (this.spa ? place.spa === this.spa : true))
        .filter(place => (this.barber ? place.barber === this.barber : true))
        .filter(place =>
          this.hairdresser ? place.hairdresser === this.hairdresser : true
        )
        .filter(place => (this.tailor ? place.tailor === this.tailor : true))
        .filter(place =>
          this.handcraft ? place.handcraft === this.handcraft : true
        )
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
    spa: {
      get() {
        return this.tags ? this.tags.includes("spa") : false;
      },
      set(val) {
        this.setQuery("spa", val);
      }
    },
    barber: {
      get() {
        return this.tags ? this.tags.includes("barber") : false;
      },
      set(val) {
        this.setQuery("barber", val);
      }
    },
    hairdresser: {
      get() {
        return this.tags ? this.tags.includes("hairdresser") : false;
      },
      set(val) {
        this.setQuery("hairdresser", val);
      }
    },
    tailor: {
      get() {
        return this.tags ? this.tags.includes("tailor") : false;
      },
      set(val) {
        this.setQuery("tailor", val);
      }
    },
    handcraft: {
      get() {
        return this.tags ? this.tags.includes("handcraft") : false;
      },
      set(val) {
        this.setQuery("handcraft", val);
      }
    }
  },
  created() {
    this.$store.dispatch("fetchCollection", "services");

    if (window.innerWidth < 576)
      this.columnWidth = (window.innerWidth - 30) / 2;
  },
  methods: {
    setIsOpen() {
      this.services.forEach(place => {
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
    services(val) {
      if (val.length) {
        this.setIsOpen();
      }
    }
  }
};
</script>
