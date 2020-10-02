<template lang="pug">
  .boats-list.main
    .title
      button.button(@click="dest = 'departToLembongan'" :class="{'active': dest === 'departToLembongan'}") Sanur to Lembongan
      button.button(@click="dest = 'departToSanur'" :class="{'active': dest === 'departToSanur'}") Lembongan to Sanur

    .daily-schedule(v-if="allDepartures[dest].length")
      .direction(v-if="!loading")
        .warning(v-if="!warnDisabled")
          button.clear(@click="disableWarning")
          .icon
          .text
            span &bull; All boats are operating on the same schedule everyday
            span &bull; This schedule is for information only, please always contact the boat company before travelling

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

    .none
      | ¯\_(ツ)_/¯ No boats today

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
      dest: "departToLembongan"
    };
  },
  computed: {
    ...mapState(["boats", "warnDisabled"]),
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
    },
    disableWarning() {
      this.$store.dispatch("setWarnDisabled", true);
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
