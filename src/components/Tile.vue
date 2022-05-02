<template lang="pug">
.tile(
    :class="{ open: openNow, alt: alt, reservation: item.reservation, warn: (opensIn !== null && opensIn >= 0) || (closesIn !== null && closesIn >= 1), new: item.new, sponsored: item.sponsored }"
)
    .content
        h2.name(v-if="!item.logo || item.sponsored === 0") {{ item.name }}

        .opening-hours(v-if="isOpenToday")
            .interval(
                v-for="time in item.openingHours[today]",
                v-if="time.start"
            )
                | {{ time.start }}-{{ time.end }}

            .closed-today(
                v-if="!item.openingHours[today][0].start && !item.reservation"
            ) closed today

        .opens-in(v-else) opens in {{ nextOpening }}

        img(v-if="item.logo && item.sponsored !== 0", :src="item.logo")

        .description(v-if="item.description && alt") {{ item.description }}

        .weekdays(v-if="!item.reservation")
            .wd(
                v-for="(weekday, wid) in item.openingHours",
                :class="{ closed: weekday[0].start === '' || !isOpenToday, today: wid === today }"
            )
                .day-names {{ weekArray[wid] }}
                span(v-if="weekday[0].start !== ''")
                    .interval(v-for="time in weekday")
                        | {{ time.start }}-{{ time.end }}

                span.closed-icon(v-else)

        .cal-wrapper(v-if="openDates")
            date-picker(:model="openDates", :config="calendarConfig")

        .info
            chip(
                v-if="chipVisible(item.properties, key)",
                v-for="(cb, key) in filters",
                :key="`chip-${key}`",
                :name="key"
            )

    .footer(:class="{ reservation: item.reservation }")
        .status
            span(v-if="opensIn !== null") Opens in:&nbsp;
                strong {{ opensIn }}m
            span(v-if="closesIn !== null") Closes in:&nbsp;
                strong {{ closesIn }}m
            span(v-if="item.reservation") Contact for details

        a.social.maps(
            v-if="item.gMapsLink",
            :href="item.gMapsLink",
            target="_blank",
            rel="noopener",
            @click="$event.stopPropagation()"
        )

        a.social.fb(
            v-if="item.facebookLink",
            :href="item.facebookLink",
            target="_blank",
            rel="noopener",
            @click="$event.stopPropagation()"
        )

        a.social.insta(
            v-if="item.instagramLink",
            :href="item.instagramLink",
            target="_blank",
            rel="noopener",
            @click="$event.stopPropagation()"
        )

        a.social.wa(
            v-if="item.contact",
            :href="waUrl(item.contact)",
            target="_blank",
            rel="noopener",
            @click="$event.stopPropagation()"
        )

    .highlight(v-if="item.new") NEW
</template>
<script>
import { mapState, mapGetters } from "vuex";
import datePicker from "@/components/DatePicker";
import chip from "@/components/Chip";
import generic from "@/mixins/generic";
import {
    isWithinInterval,
    intervalToDuration,
    differenceInSeconds,
    differenceInDays,
    formatDuration,
} from "date-fns";

let startTime, endTime;
let startTimeDiff, endTimeDiff;

export default {
    components: {
        chip,
        datePicker,
    },

    props: {
        item: Object,
        alt: Boolean,
    },

    mixins: [generic],

    computed: {
        ...mapState(["filters", "weekArray", "today"]),
        ...mapGetters(["timestamp"]),

        calendarConfig() {
            return {
                mode: "multiple",
                inline: true,
                minDate: this.formattedDate,
                monthSelectorType: "static",
                locale: {
                    firstDayOfWeek: 1,
                },
            };
        },

        openDates() {
            if (!this.item.activeDates) return false;

            return this.item.activeDates.split(", ");
        },

        isOpenToday() {
            if (!this.openDates) return true;

            return this.openDates.includes(this.formattedDate);
        },

        nextOpening() {
            let next = this.openDates.find((date) => {
                return (
                    differenceInDays(
                        this.parseDate(date),
                        this.parseDate(this.formattedDate)
                    ) > 0
                );
            });

            if (next) {
                let duration = intervalToDuration({
                    start: this.parseDate(this.formattedDate),
                    end: this.parseDate(next),
                });

                return formatDuration(duration, {
                    format: ["days"],
                });
            }

            return null;
        },

        openingHoursToday() {
            return this.item.openingHours[this.today];
        },

        openNow() {
            if (!this.isOpenToday) return false;

            return this.openingHoursToday.find((element) => {
                if (element.start && element.end) {
                    startTime = this.parseTime(element.start);
                    endTime = this.parseTime(element.end);

                    return isWithinInterval(this.timestamp, {
                        start: startTime,
                        end: endTime,
                    });
                }
            });
        },

        opensIn() {
            let sec = null;

            this.openingHoursToday.find((element) => {
                if (element.start && element.end) {
                    startTime = this.parseTime(element.start);
                    startTimeDiff = differenceInSeconds(
                        startTime,
                        this.timestamp
                    );

                    if (startTimeDiff < 1800 && startTimeDiff > 0) {
                        sec = Math.ceil(startTimeDiff / 60);
                    }
                }
            });
            return sec;
        },

        closesIn() {
            let sec = null;

            if (this.openNow) {
                endTime = this.parseTime(this.openNow.end);
                endTimeDiff = differenceInSeconds(endTime, this.timestamp);

                if (endTimeDiff < 1800 && endTimeDiff > 0) {
                    sec = Math.ceil(endTimeDiff / 60);
                }
            }
            return sec;
        },
    },

    mounted() {
        if (this.item.reservation) {
            this.item.properties.openNow = true;
        } else {
            this.item.properties.openNow = typeof this.openNow === "object";
        }
    },

    methods: {
        chipVisible(item, key) {
            if (key === "noPreorder") key = "preorder";
            return item[key] && key !== "openNow";
        },

        waUrl(contact) {
            return `https://wa.me/${contact}`;
        },
    },
};
</script>
