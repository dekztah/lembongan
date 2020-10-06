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
            span This schedule is for information only, please always contact the boat company before travelling

        .next
          span(v-if="nextBoat[dest]") next boat to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan'}} in:&nbsp;
            strong {{ nextBoat[dest].leavingIn}}
          span(v-else) All boats to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan'}} have left today

        .wrap
          .boat(v-for="(boat, index) in allDepartures[dest]" :class="{'has-left': boat.hasLeft, 'noop': !boat.operating, 'warn': boat.leavingSoon }")
            .generic
              .time(@click="toggleCalendar(index)") {{ boat[dest][today]}} {{ boat.name }}

                br
                span.location(v-if="dest === 'departToSanur'") from {{ boat.lembonganLocation}}
                .not-operating(v-if="!boat.operating") Not operating today

                span.leaving(v-if="boat.leavingIn") departs in:&nbsp;
                  strong {{ boat.leavingIn}}

              .other
                a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
                a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA

            .cal-wrapper(v-show="calOpen === index")
              flat-pickr(v-model="boat.opDays" :config="config")

        .line
          .before-noon
            .segment(v-for="segment in hoursArray['beforeNoon']")
              .hour {{ segment }}:00
              .boat(v-for="(boat, index) in allDepartures[dest]" v-if="compareTime(boat[dest][today], segment)" :class="{'has-left': boat.hasLeft, 'noop': !boat.operating, 'warn': boat.leavingSoon}")
                .content
                  h2.time {{boat[dest][today]}}
                  .name(@click="toggleCalendar(index)") {{ boat.name }}
                  .cal-wrapper(v-show="calOpen === index")
                    flat-pickr(v-model="boat.opDays" :config="config")

                .footer
                  .status
                    div(v-if="dest === 'departToSanur'") {{ boat.lembonganLocation}}
                    .not-operating(v-if="!boat.operating") Not operating today
                    span(v-if="boat.leavingIn") departs in:&nbsp;
                      strong {{ boat.leavingIn}}

                  a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
                  a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA

          .after-noon
            .segment(v-for="segment in hoursArray['afterNoon']")
              .hour {{ segment }}:00
              .boat(v-for="(boat, index) in allDepartures[dest]" v-if="compareTime(boat[dest][today], segment)" :class="{'has-left': boat.hasLeft, 'noop': !boat.operating, 'warn': boat.leavingSoon }")
                .content
                  h2.time {{boat[dest][today]}}
                  .name(@click="toggleCalendar(index)") {{ boat.name }}
                  .cal-wrapper(v-show="calOpen === index")
                    flat-pickr(v-model="boat.opDays" :config="config")

                .footer
                  .status
                    div(v-if="dest === 'departToSanur'") {{ boat.lembonganLocation}}
                    .not-operating(v-if="!boat.operating") Not operating today
                    span(v-if="boat.leavingIn") departs in:&nbsp;
                      strong {{ boat.leavingIn }}

                  a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
                  a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA

    .none(v-else)
      | ¯\_(ツ)_/¯ No boats today

</template>

<script>
import store from "@/store";
import { mapState } from "vuex";
import flatPickr from "vue-flatpickr-component";

export default {
  components: {
    flatPickr
  },
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
      dest: "departToLembongan",
      calOpen: false,
      config: {
        mode: "multiple",
        inline: true,
        locale: {
          firstDayOfWeek: 1
        }
      }
    };
  },
  computed: {
    ...mapState([
      "boats",
      "warnDisabled",
      "loading",
      "timestamp",
      "mobileNavOpen",
      "weekArray",
      "today"
    ])
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch("fetchCollection", "boats").then(() => {
      next(vm => {
        vm.destination("departToSanur");
        vm.destination("departToLembongan");
      });
    });
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
        .forEach(dep => {
          const leaveTime = this.$moment(dep[dest][this.today], "HH:mm");
          const timeDiff = leaveTime.diff(this.timestamp, "s");

          dep.operating = true;

          if (dep.activeDates) {
            let dates = dep.activeDates.split(", ");
            let formattedDate = this.timestamp.format("YYYY-MM-DD");
            dep.operating = dates.includes(formattedDate);
            dep.opDays = dates;
          }

          if (dep.operating) {
            if (this.timestamp.isAfter(leaveTime)) {
              dep.hasLeft = true;
            } else {
              if (timeDiff >= 0) {
                dep.leavingIn = this.$moment
                  .utc((timeDiff + 60) * 1000)
                  .format("HH:mm");
              }

              if (timeDiff < 1800 && timeDiff >= 0) {
                dep.leavingSoon = true;
              }
            }
          }
        });

      this.nextBoat[dest] = this.allDepartures[dest].find(item => {
        const leaveTime = this.$moment(item[dest][this.today], "HH:mm");
        return leaveTime.isAfter(this.timestamp) && item.operating;
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
    },
    toggleCalendar(index) {
      this.calOpen = this.calOpen === index ? null : index;
      // if (this.mobileNavOpen) this.$store.commit("toggleMobileNav");
    }
  },
  watch: {
    timestamp() {
      this.destination("departToSanur");
      this.destination("departToLembongan");
    }
  }
};
</script>
