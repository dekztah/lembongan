<template lang="pug">
  .boats-list.main
    .title
      button.button(@click="dest = 'departToLembongan'" :class="{'active': dest === 'departToLembongan'}")
        | Sanur to Lembongan
        br
        | Sanur to Ceningan
      button.button(@click="dest = 'departToSanur'" :class="{'active': dest === 'departToSanur'}")
        | Lembongan to Sanur
        br
        | Ceningan to Sanur

    .daily-schedule(v-if="allDepartures[dest].length")
      .direction(v-if="!loading")
        .warning(v-if="!warnDisabled")
          button.clear(@click="setWarnDisabled")
          .icon
          .text
            span This schedule is for information only, please always contact the boat company before travelling

        .next
          span(v-if="nextBoat[dest]") next boat to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan / Ceningan'}} in:&nbsp;
            br
            strong {{ nextBoat[dest].leavingIn}}
          span(v-else) All boats to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan'}} have left today

        .wrap
          .boat(v-for="(boat, index) in allDepartures[dest]" :class="{'has-left': boat.hasLeft, 'noop': !boat.operating, 'warn': boat.leavingSoon }")
            .generic
              .time(@click="toggleCalendar(index)") {{ boat[dest][today]}} {{ boat.name }}
              span.location(v-if="dest === 'departToLembongan'") to {{ boat.lembonganLocation}}
              span.location(v-if="dest === 'departToSanur'") from {{ boat.lembonganLocation}}
                .not-operating(v-if="!boat.operating") Not operating today

            .cal-wrapper(v-show="calOpen === index")
              flat-pickr(v-model="boat.opDays" :config="config")

            .other
              .status

                span.leaving(v-if="boat.leavingIn") departs in:&nbsp;
                  strong {{ boat.leavingIn}}

                span(v-if="boat.hasLeft") already left

              a.social.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank" rel="noopener")
              a.social.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank" rel="noopener") WA

        .line
          .part-of-day(v-for="(partOfDay, key) in hoursArray")
            .segment(v-for="segment in hoursArray[key]")
              .hour {{ segment }}:00
              .boat(v-for="(boat, index) in allDepartures[dest]" v-if="compareTime(boat[dest][today], segment)" :class="{'has-left': boat.hasLeft, 'noop': !boat.operating, 'warn': boat.leavingSoon}")
                .content
                  h2.time {{boat[dest][today]}}
                  .name(@click="toggleCalendar(index)") {{ boat.name }}
                  .cal-wrapper(v-show="calOpen === index")
                    flat-pickr(v-model="boat.opDays" :config="config")

                .footer
                  .status
                    .not-operating(v-if="!boat.operating") Not operating today
                    span(v-if="boat.leavingIn") departs in:&nbsp;
                      strong {{ boat.leavingIn}}
                    div(v-if="dest === 'departToSanur'") from {{ boat.lembonganLocation}}
                    div(v-if="dest === 'departToLembongan'") to {{ boat.lembonganLocation}}

                  a.social.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank" rel="noopener")
                  a.social.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank" rel="noopener") WA

    .none(v-else)
      | ¯\_(ツ)_/¯ No boats today

</template>

<script>
import store from "@/store";
import { mapState, mapActions, mapGetters } from "vuex";
import flatPickr from "vue-flatpickr-component";

import {
  differenceInMinutes,
  differenceInSeconds,
  format,
  parse,
  getHours,
  isAfter,
  intervalToDuration,
  formatDuration
} from "date-fns";

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
      "warnDisabled",
      "loading",
      "timestamp",
      "mobileNavOpen",
      "weekArray",
      "today"
    ]),
    ...mapGetters(["boats"])
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
    ...mapActions(["setWarnDisabled", "toggleMobileNav"]),
    destination(dest) {
      this.allDepartures[dest] = [];
      let formattedDate = format(this.timestamp, "yyyy-MM-dd");
      let leaveTime, timeDiff;

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
          let aTime = this.parseTime(a[dest][this.today]);
          let bTime = this.parseTime(b[dest][this.today]);
          return differenceInMinutes(aTime, bTime);
        })
        .forEach(dep => {
          leaveTime = this.parseTime(dep[dest][this.today]);
          timeDiff = differenceInSeconds(leaveTime, this.timestamp);

          dep.operating = true;

          if (dep.activeDates) {
            let dates = dep.activeDates.split(", ");
            dep.operating = dates.includes(formattedDate);
            dep.opDays = dates;
          }

          if (dep.operating) {
            if (isAfter(this.timestamp, leaveTime)) {
              dep.hasLeft = true;
            } else {
              if (timeDiff >= 0) {
                let duration = intervalToDuration({
                  start: this.timestamp,
                  end: leaveTime
                });

                dep.leavingIn = formatDuration(duration, {
                  format: ["hours", "minutes"]
                });
              }

              if (timeDiff < 1800 && timeDiff >= 0) {
                dep.leavingSoon = true;
              }
            }
          }
        });

      this.nextBoat[dest] = this.allDepartures[dest].find(item => {
        const leaveTime = this.parseTime(item[dest][this.today]);
        return isAfter(leaveTime, this.timestamp) && item.operating;
      });
    },
    compareTime(a, b) {
      return getHours(this.parseTime(a)) === b;
    },
    parseTime(time) {
      return parse(time, "HH:mm", new Date());
    },
    waUrl(contact) {
      return `https://wa.me/${contact}`;
    },
    toggleCalendar(index) {
      this.calOpen = this.calOpen === index ? null : index;
      if (this.mobileNavOpen) this.toggleMobileNav();
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
