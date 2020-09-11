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
        input(type="checkbox" v-model="drinks" id="drinks")
        label(for="drinks")
        .text drinks

      .count(v-if="!loading") {{ filteredPlaces.length }} results

    isotope.placelist(v-if="!loading" :list="filteredPlaces" :options="isotopeOptions" ref="isotope")
      .place(v-for="(place, index) in filteredPlaces" :class="{'open': place.isOpen, 'double': isDouble === index, 'warn': (place.opensIn !== null && place.opensIn >= 0) || (place.closesIn !== null && place.closesIn >= 1) }" :key="`place-${index}`")
        .content(@click="toggleDouble(index)")
          h2.name {{ place.name }}

          .weekdays
            .wd(v-for="(weekday, wid) in place.openingHours" :class="{'closed': typeof weekday === 'string', 'today' : wid === today}")
              div.day-names {{ weekArray[wid] }}
              span(v-if="typeof weekday === 'object'")
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
            span.chip.drinks(v-if="place.drinks") drinks

        .footer
          .status
            span(v-if="place.opensIn !== null") Opens in:&nbsp;
              strong {{ place.opensIn + 1 }}m
            span(v-if="place.closesIn !== null") Closes in:&nbsp;
              strong {{ place.closesIn + 1 }}m

          a.maps(v-if="place.gMapsLink" :href="place.gMapsLink" target="_blank")
          a.fb(v-if="place.facebookLink" :href="place.facebookLink" target="_blank")
          a.wa(v-if="place.contact" :href="waUrl(place.contact)" target="_blank")

</template>

<script>
import { db } from "@/firebase";
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
      places: [],
      isDouble: false,
      columnWidth: 180
    };
  },
  computed: {
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
          query: { q: val, tags: this.tags, open: this.status }
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
    if (window.innerWidth < 576)
      this.columnWidth = (window.innerWidth - 30) / 2;
  },
  mounted() {
    db.ref("places")
      .orderByChild("name")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(child => {
          this.places.push(child.val());
        });
        this.$store.commit("toggleLoading", false);
        this.setIsOpen();
      });
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
    timestamp() {
      this.setIsOpen();
    }
  }
};
</script>

<style lang="scss">
@import "../assets/styles/variables";

.placelist {
  margin-top: 130px;
  padding: 10px;
  transition: transform 0.3s ease-out;

  @media only screen and (max-width: $breakpoint-small) {
    margin-top: 85px;
  }
}
.place {
  background: #fff;
  margin-bottom: 10px;
  align-items: center;
  width: 180px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);

  .day-names {
    display: none;
    font-weight: 600;
  }

  &.double {
    width: 370px;

    .day-names {
      display: block;
      text-align: center;
    }
    .interval {
      padding: 4px 4px 0 4px;
      text-align: center;

      &:not(:first-child) {
        border-top: 1px solid #ccc;
      }
      &:not(:last-child) {
        padding-bottom: 4px;
      }
    }

    .closed-icon-text {
      padding-top: 4px;

      .text {
        display: none;
      }
      .icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url(../assets/Closed.svg);
        background-size: 24px 24px;
      }
    }

    .wd {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      padding: 8px 0;

      @media only screen and (max-width: $breakpoint-small) {
        font-size: 12px;
      }

      &:not(:last-child) {
        border-right: 1px solid #ccc;
      }

      &.today {
        background: #f1f1f1;
      }
    }
  }

  @media only screen and (max-width: $breakpoint-small) {
    width: calc(50% - 15px);

    &.double {
      width: calc(100% - 20px);
    }
  }

  .content {
    padding: 10px;
  }
  &.open {
    h2.name {
      &:before {
        background: #00ff00;
      }
    }
  }
  &.warn {
    h2.name {
      &:before {
        background: #ff9900;
      }
    }
  }
  h2.name {
    font-size: 16px;
    margin-top: 0;
    vertical-align: middle;
    cursor: pointer;

    &:before {
      display: inline-block;
      content: "";
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: red;
      vertical-align: middle;
      margin: 0 6px 2px 0;
    }
  }
}
.weekdays {
  display: flex;
}
.wd {
  display: none;
  align-items: center;
  flex: 1;

  hr {
    margin: 2px 0;
  }

  &.today {
    display: flex;
  }

  &.closed {
    &.today {
      display: flex;

      font-weight: 600;
    }

    .closed-icon-text {
      align-items: center;
      display: flex;
      flex: 1;

      .text {
        color: #ff0000;
      }
    }
  }
}

.filter {
  margin-right: 15px;
  position: relative;

  @media only screen and (max-width: $breakpoint-small) {
    margin-right: 0;
  }

  input[type="text"] {
    border: none;
    border-radius: 12px;
    height: 24px;
    padding: 4px 28px 4px 8px;
    vertical-align: middle;

    @media only screen and (max-width: $breakpoint-small) {
      width: 100%;
    }

    &:focus {
      outline: none;
    }
  }
  .clear {
    border: none;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    background: none;
    display: inline-block;
    background-image: url(../assets/Clear.svg);
    background-size: 16px 16px;
    position: absolute;
    top: 4px;
    right: 10px;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }
  @media only screen and (max-width: $breakpoint-small) {
    margin-bottom: 10px;
  }
}
.count {
  align-self: center;
  margin-left: auto;
}
.info {
  margin-top: 10px;
}
.chip {
  display: inline-block;
  border-radius: 10px;
  padding: 2px 8px;
  background: #ccc;
  margin: 6px 6px 0 0;
  font-size: 12px;
  color: white;

  &.dine-in {
    background: #ff00b0;
  }
  &.preorder {
    background: #0066ff;
  }
  &.delivery {
    background: #990099;
  }
  &.local-dishes {
    background: #52eaab;
  }
  &.coffee {
    background: #a24011;
  }
  &.drinks {
    background: #fdd92b;
  }
}
.footer {
  // margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #ddd;
  padding: 10px;

  .status {
    margin-right: auto;
    font-size: 12px;
  }
}
</style>
