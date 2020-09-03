<template lang="pug">
  .food-and-drink
    .filter-control
      .filter
        label open places only
        input(type="checkbox" v-model="open")
      .filter
        label dine-in only
        input(type="checkbox" v-model="dineIn")
      .filter
        label delivery only
        input(type="checkbox" v-model="delivery")

    .place(v-for="(place, index) in filteredPlaces" :class="{'open': place.isOpen}")
      strong.name {{ place.name }}

      .weekdays
        .wd(v-for="(weekday, wid) in place.openingHours" :class="{'closed': typeof weekday === 'string', 'today' : wid === today}")
          span(v-if="typeof weekday === 'object'")
            div(v-for="time in weekday")
              | {{ time.start }}-{{ time.end }}

          span(v-else)
      .info
        //- span x {{ place.isOpen }}
        span.chip(v-if="place.dineIn") dine-in
        span.chip(v-if="place.preorder") preorder
        span.chip(v-if="place.delivery") delivery

      .contact Contact: {{ place.contact }}

</template>

<script>
import { db } from '@/db';

export default {
  data() {
    return {
      places: [],
      open: false,
      dineIn: false,
      delivery: false,
    };
  },
  computed: {
    timestamp() {
      return this.$store.state.timestamp;
    },
    today() {
      return this.$store.state.timestamp.day() - 1;
    },
    filteredPlaces() {
      console.log('computed filtered places');
      this.setIsOpen();
      return this.places
        .filter((place) => {
          if (this.open) {
            return place.isOpen === this.open;
          } else {
            return true;
          }
        })
        .filter((place) => {
          if (this.dineIn) {
            return place.dineIn === this.dineIn;
          } else {
            return true;
          }
        })
        .filter((place) => {
          if (this.delivery) {
            return place.delivery === this.delivery;
          } else {
            return true;
          }
        });
    },
  },
  firebase: {
    places: db.ref('places'),
  },
  mounted() {},
  methods: {
    setIsOpen() {
      this.places.forEach((place) => {
        const today = this.timestamp.day() - 1;
        const time = this.timestamp.format('HH:mm');
        place.isOpen = false;

        if (typeof place.openingHours[today] === 'object') {
          place.openingHours[today].forEach((element) => {
            const startTime = this.$moment(element.start, 'HH:mm');
            const endTime = this.$moment(element.end, 'HH:mm');

            if (this.$moment(time, 'HH:mm').isBetween(startTime, endTime)) {
              place.isOpen = true;
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.place {
  border: 1px solid #ccc;
  border-left: 20px solid red;
  margin-bottom: 2px;
  padding: 10px;
  display: flex;
  align-items: center;

  &.open {
    border-left-color: lightgreen;
  }
  .name {
    width: 200px;
  }
}
.weekdays {
  display: flex;
}
.wd {
  display: flex;
  align-items: center;
  width: 90px;
  height: 40px;
  margin-right: 1px;
  background: lightgreen;

  &.today {
    background: darken(lightgreen, 20);
  }

  &.closed {
    background: #eee;

    &.today {
      background: darken(#eee, 20);
    }
  }
}
.filter-control {
  display: flex;
}
.chip {
  display: inline-block;
  border-radius: 10px;
  padding: 2px 8px;
  background: #ccc;
  margin-right: 6px;
}
</style>
