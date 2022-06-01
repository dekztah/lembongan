<template lang="pug">
.admin-form(v-if="!loading")
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
import { ref, child, push } from "firebase/database";
import { mapState } from "vuex";
import schema from "@/assets/boats-schema.json";

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
                    this.$store.commit("toggleLoading", false);
                });
        } else {
            this.$set(this, "form", this.schema);
            this.$store.commit("toggleLoading", false);
        }
    },

    methods: {
        addDepartureTime(destination, day) {
            this.form[destination][day].push("");
        },

        removeDepartureTime(destination, index, day) {
            this.form[destination][day].splice(index, 1);
        },

        insert() {
            this.saveDisabled = true;
            this.key =
                this.key === undefined
                    ? push(child(ref(db), "boats")).key
                    : this.key;

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
