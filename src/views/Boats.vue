<template lang="pug">
  .boats-list.main
    .title
      button.button(@click="dest = 'departToSanur'" :class="{'active': dest === 'departToSanur'}") Lembongan to Sanur
      button.button(@click="dest = 'departToLembongan'" :class="{'active': dest === 'departToLembongan'}") Sanur to Lembongan

    .daily-schedule
      .direction
        .next next boat to {{ dest === 'departToSanur' ? 'Sanur' : 'Lembongan'}} in:&nbsp;
          strong {{ nextBoatFormatted(dest) }}

        .wrap
          .boat(v-for="boat in destination(dest)" :class="{'has-left': boat.hasLeft, 'warn': (boat.leavingIn !== null && boat.leavingIn >= 0)}")
            .time {{ boat[dest][today]}} {{ boat.name }}
              br
              span.leaving(v-if="boat.leavingIn !== null") Leaving in:&nbsp;
                strong {{ boat.leavingIn + 1}}m
            .other


              a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
              a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA

        .line
          .before-noon
            .segment(v-for="segment in hoursArray['beforeNoon']")
              .hour {{ segment }}:00
              .boat(v-for="boat in destination(dest)" v-if="compareTime(boat[dest][today], segment)" :class="{'has-left': boat.hasLeft, 'warn': (boat.leavingIn !== null && boat.leavingIn >= 0)}")
                .content
                  h2.time {{boat[dest][today]}}
                  .name {{ boat.name}}

                .footer
                  .status
                    span(v-if="boat.leavingIn !== null") Leaving in:&nbsp;
                      strong {{ boat.leavingIn + 1}}m

                  a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
                  a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA

          .after-noon
            .segment(v-for="segment in hoursArray['afterNoon']")
              .hour {{ segment }}:00
              .boat(v-for="boat in destination(dest)" v-if="compareTime(boat[dest][today], segment)" :class="{'has-left': boat.hasLeft, 'warn': (boat.leavingIn !== null && boat.leavingIn >= 0)}")
                .content
                  h2.time {{boat[dest][today]}}
                  .name {{ boat.name }}

                .footer
                  .status
                    span(v-if="boat.leavingIn !== null") Leaving in:&nbsp;
                      strong {{ boat.leavingIn + 1}}m

                  a.maps(v-if="boat.gMapsLink" :href="boat.gMapsLink" target="_blank")
                  a.wa(v-if="boat.contact" :href="waUrl(boat.contact)" target="_blank") WA


</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      boats: [],
      hoursArray: {
        beforeNoon: [7, 8, 9, 10, 11],
        afterNoon: [12, 13, 14, 15, 16]
      },
      nextBoatIn: {
        departToLembongan: 86400,
        departToSanur: 86400
      },
      dest: "departToSanur"
    };
  },
  computed: {
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
  mounted() {
    db.ref("boats")
      .orderByChild("name")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(child => {
          this.boats.push(child.val());
        });
        this.$store.commit("toggleLoading", false);
      });
  },
  methods: {
    destination(dest) {
      let departures = [];
      const time = this.$moment(this.timestamp, "HH:mm");

      this.boats.forEach(boat => {
        if (boat[dest] && typeof boat[dest][this.today] === "object") {
          boat[dest][this.today].forEach(leaveTime => {
            let departure = JSON.parse(JSON.stringify(boat));
            departure.hasLeft = true;
            departure.leavingIn = null;
            departure[dest][this.today] = leaveTime;
            const leaveTimeMoment = this.$moment(leaveTime, "HH:mm");

            if (leaveTimeMoment.diff(time, "s") > 0) {
              if (leaveTimeMoment.diff(time, "s") < this.nextBoatIn[dest]) {
                this.nextBoatIn[dest] = leaveTimeMoment.diff(time, "s");
                if (this.nextBoatIn[dest] <= 0) {
                  this.nextBoatIn[dest] = 86400;
                }
              }
            }

            if (this.$moment(time, "HH:mm").isBefore(leaveTimeMoment)) {
              departure.hasLeft = false;
            }
            if (
              leaveTimeMoment.diff(time, "s") < 1800 &&
              leaveTimeMoment.diff(time, "s") >= 0
            ) {
              departure.leavingIn = leaveTimeMoment.diff(time, "m");
            }
            departures.push(departure);
          });
        }
      });

      return departures.sort((a, b) => {
        let aTime = this.$moment(a[dest][this.today], "HH:mm");
        let bTime = this.$moment(b[dest][this.today], "HH:mm");
        return aTime.diff(bTime, "m");
      });
    },
    nextBoatFormatted(dest) {
      return this.$moment.utc(this.nextBoatIn[dest] * 1000).format("HH:mm");
    },
    compareTime(a, b) {
      return this.$moment(a, "HH:mm").hour() === b;
    },
    waUrl(contact) {
      return `https://wa.me/${contact}`;
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
      color: rgba(255, 255, 255, 0.4);
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
