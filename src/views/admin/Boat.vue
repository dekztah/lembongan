<template lang="pug">
.admin-form
    .top
        .grid-item
            .form-element
                label Boat company name
                input(type="text", v-model="form.name")

            .form-element
                label Contact
                input(type="number", v-model="form.contact")

            .form-element
                label Maps link
                input(type="text", v-model="form.gMapsLink")

            .form-element
                label Facebook link
                input(type="text", v-model="form.facebookLink")

            .form-element
                label Instagram link
                input(type="text", v-model="form.instagramLink")

            .form-element
                label Lembongan departure location
                input(type="text", v-model="form.lembonganLocation")

            .form-element
                label Active
                input(type="checkbox", v-model="form.active")

        .grid-item
            flat-pickr(
                v-model="form.activeDates",
                :config="config",
                @on-month-change="setDaysInMonth",
                ref="cal"
            )
            button.button(@click="setAllDays") every day

    .bottom
        .opening-hours
            label To Sanur
            .weekdays
                .weekday(
                    v-for="(departure, day) in form.departToSanur",
                    :key="`departure${day}${form.departToSanur.length}`"
                )
                    label {{ weekArray[day] }}

                    .items(v-for="(depTime, index) in departure")
                        .item
                            label departs
                            input(
                                type="time",
                                v-model="form.departToSanur[day][index]"
                            )

                        button.button(
                            v-if="index !== 0",
                            @click="removeDepartureTime('departToSanur', index, day)"
                        ) x

                    button.button(
                        @click="addDepartureTime('departToSanur', day)"
                    ) +

        .opening-hours
            label To Lembongan
            .weekdays
                .weekday(v-for="(departure, day) in form.departToLembongan")
                    label {{ weekArray[day] }}

                    .items(v-for="(depTime, index) in departure")
                        .item
                            label departs
                            input(
                                type="time",
                                v-model="form.departToLembongan[day][index]"
                            )

                        button.button(
                            v-if="index !== 0",
                            @click="removeDepartureTime('departToLembongan', index, day)"
                        ) x

                    button.button(
                        @click="addDepartureTime('departToLembongan', day)"
                    ) +

    .save
        button.button(@click="insert", :disabled="saveDisabled") save
</template>

<script>
import { db } from "@/firebase/firebase";
import { mapState } from "vuex";
import flatPickr from "vue-flatpickr-component";
import schema from "@/assets/boats-schema.json";
import { getDaysInMonth, isAfter, parse, getYear, getMonth } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export default {
    data() {
        return {
            config: {
                mode: "multiple",
                inline: true,
                locale: {
                    firstDayOfWeek: 1,
                },
            },
            form: schema,
            key: this.$route.params.id,
            saveDisabled: false,
            daysInMonth: [],
        };
    },

    components: {
        flatPickr,
    },

    computed: {
        ...mapState(["document", "loading", "weekArray", "timestamp"]),

        schema() {
            const schema = require("@/assets/boats-schema.json");
            return JSON.parse(JSON.stringify(schema));
        },
    },

    mounted() {
        if (this.key !== undefined) {
            this.$store
                .dispatch("fetchDocument", {
                    collectionName: "boats",
                    id: this.key,
                })
                .then(() => {
                    this.$set(this, "form", this.document);
                });
        } else {
            this.$set(this, "form", this.schema);
            this.$store.commit("toggleLoading", false);
        }

        this.setDaysInMonth();
        // this.$refs.cal.fp.jumpToDate(this.timestamp);
    },

    methods: {
        addDepartureTime(destination, day) {
            this.form[destination][day].push("");
        },
        removeDepartureTime(destination, index, day) {
            this.form[destination][day].splice(index, 1);
        },
        setAllDays() {
            if (
                isAfter(
                    parse(
                        this.daysInMonth[0],
                        "yyyy-MM-dd",
                        utcToZonedTime(new Date(), "Asia/Makassar")
                    ),
                    this.timestamp
                )
            ) {
                this.$set(
                    this.form,
                    "activeDates",
                    this.daysInMonth
                        .join(", ")
                        .concat(", ", this.form.activeDates)
                );
            } else {
                this.form.activeDates = this.daysInMonth.join(", ");
            }
        },
        setDaysInMonth(selectedDates, dateStr, instance) {
            let year, month;

            if (instance) {
                year = instance.currentYear;
                month = instance.currentMonth;
            } else {
                year = getYear(this.timestamp);
                month = getMonth(this.timestamp);
            }

            let daysCount = getDaysInMonth(new Date(year, month));

            this.daysInMonth = Array.from(
                { length: daysCount },
                (v, i) => `${year}-${month + 1}-${i + 1}`
            );
        },
        insert() {
            this.saveDisabled = true;
            this.key =
                this.key === undefined ? db.ref("boats").push().key : this.key;

            let updates = {};
            updates["/boats/" + this.key] = this.form;

            this.$store.dispatch("update", updates).then(() => {
                this.saveDisabled = false;
                if (!this.$route.params.id)
                    this.$router.push({ params: { id: this.key } });
            });
        },
    },
};
</script>
