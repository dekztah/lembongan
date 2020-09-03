<template lang="pug">
  .food-and-drink
    .filter-control
      .filter
        input(type="checkbox" v-model="open")
        label open places only

      .filter
        input(type="checkbox" v-model="dineIn")
        label dine-in only

      .filter
        input(type="checkbox" v-model="delivery")
        label delivery only

      .filter
        input(type="checkbox" v-model="noPreorder")
        label no preorder

      .filter
        label search by name:&nbsp;
        input(type="text" v-model="search")

    isotope.placelist(:list="filteredPlaces" :options="isotopeOptions")
      .place(v-for="(place, index) in filteredPlaces" :class="{'open': place.isOpen, 'warn': (place.opensIn !== null && place.opensIn >= 0) || (place.closesIn !== null && place.closesIn >= 1) }" :key="`place-${index}`")
        .content
          h2.name {{ place.name }}

          .weekdays
            .wd(v-for="(weekday, wid) in place.openingHours" :class="{'closed': typeof weekday === 'string', 'today' : wid === today}")
              span(v-if="typeof weekday === 'object'")
                div(v-for="time in weekday")
                  | {{ time.start }}-{{ time.end }}

              span(v-else).closed Closed today
          .info
            //- span x {{ place.isOpen }}

            span.chip.dine-in(v-if="place.dineIn") dine-in
            span.chip.preorder(v-if="place.preorder") preorder
            span.chip.delivery(v-if="place.delivery") delivery

        .footer
          .status
            span(v-if="place.opensIn !== null") Opens in:&nbsp;
              strong {{ place.opensIn + 1 }}m
            span(v-if="place.closesIn !== null") Closes in:&nbsp;
              strong {{ place.closesIn + 1 }}m
          a.maps(v-if="place.gMapsLink" :href="place.gMapsLink" target="_blank")
          a.wa(v-if="place.contact" :href="place.contact" target="_blank") WA

</template>

<script>
import { db } from '@/db';
import isotope from 'vueisotope';

export default {
  components: {
    isotope,
  },
  data() {
    return {
      places: [],
      open: false,
      dineIn: false,
      delivery: false,
      noPreorder: false,
      search: null,
    };
  },
  computed: {
    timestamp() {
      return this.$store.state.timestamp;
    },
    today() {
      return this.$store.state.timestamp.day() - 1;
    },
    isotopeOptions() {
      return {
        transitionDuration: '0.3s',
      };
    },
    filteredPlaces() {
      this.setIsOpen();
      return this.places
        .filter((place) => (this.open ? place.isOpen === this.open : true))
        .filter((place) => (this.dineIn ? place.dineIn === this.dineIn : true))
        .filter((place) =>
          this.delivery ? place.delivery === this.delivery : true
        )
        .filter((place) =>
          this.noPreorder ? place.preorder !== this.noPreorder : true
        )
        .filter((place) =>
          this.search
            ? place.name.toLowerCase().includes(this.search.toLowerCase())
            : true
        );
    },
  },
  firebase: {
    places: db.ref('places').orderByChild('name'),
  },
  mounted() {},
  methods: {
    setIsOpen() {
      this.places.forEach((place) => {
        const today = this.timestamp.day() - 1;
        const time = this.$moment(this.timestamp, 'HH:mm');
        place.isOpen = false;
        place.opensIn = null;
        place.closesIn = null;

        if (typeof place.openingHours[today] === 'object') {
          place.openingHours[today].forEach((element) => {
            const startTime = this.$moment(element.start, 'HH:mm');
            const endTime = this.$moment(element.end, 'HH:mm');

            if (this.$moment(time, 'HH:mm').isBetween(startTime, endTime)) {
              place.isOpen = true;
            }

            if (
              startTime.diff(time, 's') < 1800 &&
              startTime.diff(time, 's') >= 0
            ) {
              place.opensIn = startTime.diff(time, 'm');
            }

            if (
              endTime.diff(time, 's') < 1800 &&
              endTime.diff(time, 's') >= 0
            ) {
              place.closesIn = endTime.diff(time, 'm');
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.placelist {
  margin-top: 130px;
  padding: 5px;
}
.place {
  background: #fff;
  margin: 5px;
  align-items: center;
  width: 180px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);

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

    &:before {
      display: inline-block;
      content: '';
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
  margin-right: 1px;

  &.today {
    display: flex;
  }

  &.closed {
    &.today {
      display: flex;
      color: red;
      font-weight: 600;
    }
  }
}
.filter-control {
  display: flex;
  position: fixed;
  background: darken(#92e6ff, 20);
  width: 100%;
  z-index: 1;
  padding: 10px;
  top: 85px;
}
.filter {
  margin-right: 10px;

  input[type='text'] {
    border: 1px solid #999;
    border-radius: 4px;
    padding: 4px;
  }
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
}
.footer {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #ddd;
  padding: 10px;

  .status {
    margin-right: auto;
    font-size: 12px;
  }

  .maps {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-image: url(../assets/GoogleMaps.svg);
    text-indent: -9999px;
    background-size: 32px 32px;
  }

  .wa {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-image: url(../assets/WhatsApp.svg);
    text-indent: -9999px;
    background-size: 32px 32px;
  }
}
</style>
