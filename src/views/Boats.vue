<template lang="pug">
  .boats-list.main
    .title
      button.button(@click="dest = 'departToSanur'" :class="{'active': dest === 'departToSanur'}") Lembongan to Sanur
      button.button(@click="dest = 'departToLembongan'" :class="{'active': dest === 'departToLembongan'}") Sanur to Lembongan

    .daily-schedule
      .direction(v-if="!loading")
        .next
          span(v-if="nextBoat[dest]") next boat to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan'}} in:&nbsp;
            strong {{ nextBoat[dest].leavingIn}}
          span(v-else) All boats to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan'}} have left today

        .wrap
          .boat(v-for="boat in allDepartures[dest]" :class="{'has-left': boat.hasLeft, 'warn': boat.leavingSoon }")
            .time {{ boat[dest][today]}} {{ boat.name }}
              br
              span.location(v-if="dest === 'departToSanur'") from {{ boat.lembonganLocation}}
              span.leaving(v-if="boat.leavingIn") departs in:&nbsp;
                strong {{ boat.leavingIn}}

            .other
              a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
              a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA

        .line
          .before-noon
            .segment(v-for="segment in hoursArray['beforeNoon']")
              .hour {{ segment }}:00
              .boat(v-for="boat in allDepartures[dest]" v-if="compareTime(boat[dest][today], segment)" :class="{'has-left': boat.hasLeft, 'warn': boat.leavingSoon}")
                .content
                  h2.time {{boat[dest][today]}}
                  .name {{ boat.name}}

                .footer
                  .status
                    div(v-if="dest === 'departToSanur'") {{ boat.lembonganLocation}}
                    span(v-if="boat.leavingIn") departs in:&nbsp;
                      strong {{ boat.leavingIn}}

                  a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
                  a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA

          .after-noon
            .segment(v-for="segment in hoursArray['afterNoon']")
              .hour {{ segment }}:00
              .boat(v-for="boat in allDepartures[dest]" v-if="compareTime(boat[dest][today], segment)" :class="{'has-left': boat.hasLeft, 'warn': boat.leavingSoon }")
                .content
                  h2.time {{boat[dest][today]}}
                  .name {{ boat.name }}

                .footer
                  .status
                    div(v-if="dest === 'departToSanur'") {{ boat.lembonganLocation}}
                    span(v-if="boat.leavingIn") departs in:&nbsp;
                      strong {{ boat.leavingIn }}

                  a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
                  a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA

</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      allDepartures: {
        departToSanur: [],
        departToLembongan: []
      },
      hoursArray: {
        beforeNoon: [7, 8, 9, 10, 11],
        afterNoon: [12, 13, 14, 15, 16]
      },
      nextBoat: {
        departToLembongan: [],
        departToSanur: []
      },
      dest: "departToSanur"
    };
  },
  computed: {
    ...mapState(["boats"]),
    loading() {
      return this.$store.state.loading;
    },
    timestamp() {
      return this.$store.state.timestamp;
    },
    mobileNavOpen() {
      return this.$store.state.mobileNavOpen;
    },
    weekArray() {
      return this.$store.state.weekArray;
    },
    today() {
      return this.$store.state.timestamp.isoWeekday() - 1;
    }
  },
  created() {
    this.$store.dispatch("fetchCollection", "boats");
    if (this.boats.length) {
      this.destination("departToSanur");
      this.destination("departToLembongan");
    }
  },
  methods: {
    destination(dest) {
      this.allDepartures[dest] = [];
      this.boats
        .filter(boat => boat.active === true)
        .forEach(boat => {
          let departures = boat[dest][this.today];

          departures.forEach(val => {
            boat = JSON.parse(JSON.stringify(boat));
            boat[dest][this.today] = val;
            this.allDepartures[dest].push(boat);
          });
        });

      this.allDepartures[dest]
        .sort((a, b) => {
          let aTime = this.$moment(a[dest][this.today], "HH:mm");
          let bTime = this.$moment(b[dest][this.today], "HH:mm");
          return aTime.diff(bTime, "m");
        })
        .forEach((dep, index) => {
          const leaveTime = this.$moment(dep[dest][this.today], "HH:mm");
          const timeDiff = leaveTime.diff(this.timestamp, "s");

          if (timeDiff >= 0) {
            dep.leavingIn = this.$moment
              .utc((timeDiff + 60) * 1000)
              .format("HH:mm");
          }

          if (timeDiff < 1800 && timeDiff >= 0) {
            dep.leavingSoon = true;
          }

          if (this.timestamp.isAfter(leaveTime)) {
            dep.hasLeft = true;

            if (index === this.allDepartures[dest].length - 1) {
              this.nextBoat[dest] = false;
            } else {
              this.nextBoat[dest] = this.allDepartures[dest][index + 1];
            }
          }
        });
    },
    compareTime(a, b) {
      return this.$moment(a, "HH:mm").hour() === b;
    },
    waUrl(contact) {
      return `https://wa.me/${contact}`;
    }
  },
  watch: {
    timestamp() {
      this.destination("departToSanur");
      this.destination("departToLembongan");
    },
    boats(val) {
      if (val.length) {
        this.destination("departToSanur");
        this.destination("departToLembongan");
      }
    }
  }
};
</script>
<style lang="scss">
@import "../assets/styles/variables";

.boats-list {
  .daily-schedule {
    padding: 10px;
  }
  .title {
    display: flex;
    align-items: center;

    button {
      flex: 1;
      background: darken(#92e6ff, 10);
      color: rgba(255, 255, 255, 0.8);
      border-radius: 0;
      height: 44px;

      &.active {
        background: none;
        font-weight: 600;
        color: black;
        box-shadow: none;
      }
      &:focus {
        outline: none;
      }
    }
  }
}
.direction {
  .next {
    text-align: center;
    margin-bottom: 10px;
  }
  h2 {
    font-size: 16px;
  }
}
.wrap {
  display: none;

  @media only screen and (max-width: $breakpoint-small) {
    display: block;
  }
  .boat {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .other {
      display: flex;
      align-items: center;
    }
    .leaving {
      display: inline-block;
      margin-top: 8px;
      font-weight: 400;
    }
  }
}
.boat {
  margin-top: 10px;
  // font-weight: 600;
  background: white;
  border-radius: 4px;
  margin: 5px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);

  .content {
    padding: 10px;
  }

  .footer {
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

  .time {
    font-size: 16px;
    font-weight: 600;
    margin-top: 0;
    vertical-align: middle;

    &:before {
      display: inline-block;
      content: "";
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #00ff00;
      vertical-align: middle;
      margin: 0 6px 2px 0;
    }
  }
  .location {
    font-weight: 400;
    font-size: 12px;
    display: block;
    margin-top: 8px;
  }
  .name {
    font-size: 16px;
  }

  &.warn {
    .time {
      &:before {
        background: #ff9900;
      }
    }
  }

  &.has-left {
    opacity: 0.5;
    font-weight: 400;

    .time {
      &:before {
        background: red;
      }
    }
  }
}
.line {
  margin-top: 40px;

  @media only screen and (max-width: $breakpoint-small) {
    display: none;
  }
}
.before-noon,
.after-noon {
  display: flex;
}
.segment {
  flex: 1;

  &:last-child {
    .hour {
      border-right: 1px solid black;
    }
  }

  .hour {
    padding: 2px;
    border-bottom: 1px solid black;
    border-left: 1px solid black;
    font-size: 12px;
  }
}
</style>
