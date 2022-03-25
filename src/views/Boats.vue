<template lang="pug">
  .boats-list.main
    .title
      button.button(@click="dest = 'departToLembongan'" :class="{'active': dest === 'departToLembongan'}")
        | Sanur to Lembongan
      button.button(@click="dest = 'departToSanur'" :class="{'active': dest === 'departToSanur'}")
        | Lembongan to Sanur

    .daily-schedule(v-if="schedule[dest].length")
      .direction(v-if="!loading")
        .warning(v-if="!warnDisabled")
          button.clear(@click="setWarnDisabled")
          .icon
          .text
            span This schedule is for information only, please always contact the boat company before travelling

        .next
          span(v-if="nextBoat") next boat to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan / Ceningan'}} in:&nbsp;
            br
            strong {{ nextBoat.leavingIn }}
          span(v-else) All boats to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan'}} have left today

        .wrap(v-if="isMobile")
          schedule-entry(
            v-for="boat in schedule[dest]"
            :entry="boat"
            :dest="dest"
            :key="`${boat.name}-${boat.departure}`"
          )

        .line(v-else)
          .part-of-day(v-for="(partOfDay, key) in hoursArray")
            .segment(v-for="segment in hoursArray[key]")
              .hour {{ segment }}:00

              schedule-entry(
                v-for="boat in schedule[dest]"
                v-if="compareTime(boat.departure, segment)"
                :entry="boat"
                :dest="dest"
                :key="`${boat.name}-${boat.departure}`"
              )

    .none(v-else)
      | ¯\_(ツ)_/¯ No boats today

</template>

<script>
import store from "@/store";
import { mapState, mapActions, mapGetters } from "vuex";
import generic from "@/mixins/generic";
import scheduleEntry from "@/components/ScheduleEntry";

import {
    differenceInMinutes,
    getHours,
    isAfter,
    intervalToDuration,
    formatDuration,
} from "date-fns";

export default {
    components: {
        scheduleEntry,
    },
    mixins: [generic],
    data() {
        return {
            schedule: {
                departToSanur: [],
                departToLembongan: [],
            },
            hoursArray: {
                beforeNoon: [7, 8, 9, 10, 11],
                afterNoon: [12, 13, 14, 15, 16],
            },
            dest: "departToLembongan",
        };
    },
    computed: {
        ...mapState([
            "warnDisabled",
            "loading",
            "mobileNavOpen",
            "weekArray",
            "today",
        ]),
        ...mapGetters(["boats", "timestamp", "isMobile"]),
        nextBoat() {
            return this.schedule[this.dest].find((item) => {
                const leaveTime = this.parseTime(item.departure);

                if (isAfter(leaveTime, this.timestamp)) {
                    let duration = intervalToDuration({
                        start: this.timestamp,
                        end: leaveTime,
                    });

                    item.leavingIn = formatDuration(duration, {
                        format: ["hours", "minutes"],
                    });
                    return item;
                }
            });
        },
    },
    beforeRouteEnter(to, from, next) {
        store.dispatch("fetchCollection", "boats").then(() => {
            next((vm) => {
                vm.makeSchedule("departToSanur");
                vm.makeSchedule("departToLembongan");
            });
        });
    },
    methods: {
        ...mapActions(["setWarnDisabled", "toggleMobileNav"]),
        makeSchedule(dest) {
            this.schedule[dest] = this.boats
                .filter((boat) => boat.active === true)
                .map((boat) => {
                    let departures = boat[dest][this.today];

                    return departures.map((val) => {
                        boat = JSON.parse(JSON.stringify(boat));
                        boat.departure = val;
                        return boat;
                    });
                })
                .flat()
                .sort((a, b) => {
                    let aTime = this.parseTime(a.departure);
                    let bTime = this.parseTime(b.departure);
                    return differenceInMinutes(aTime, bTime);
                });
        },
        compareTime(a, b) {
            return getHours(this.parseTime(a)) === b;
        },
    },
};
</script>
