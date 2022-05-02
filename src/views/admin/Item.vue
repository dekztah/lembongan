<template lang="pug">
.admin-form
    .top
        .grid-item
            .form-element
                label Name
                input(type="text", v-model="form.name")

            .form-element
                label Description
                input(type="text", v-model="form.description")

            .form-element
                label Owner
                input(type="text", v-model="form.owner", :disabled="!isAdmin")

            .form-element
                label Contact
                input(type="number", v-model="form.contact")

            .form-element
                label Facebook link
                input(type="text", v-model="form.facebookLink")

            .form-element
                label Instagram link
                input(type="text", v-model="form.instagramLink")

            .form-element
                label Maps link
                input(type="text", v-model="form.gMapsLink")

            .form-element
                label Sponsored
                select(v-model="form.sponsored")
                    option(:value="0") not sponsored
                    option(:value="1") level 1
                    option(:value="2") level 2
                    option(:value="3") level 3
                    option(:value="4") level 4

            .form-element(v-if="form.sponsored > 0")
                label Logo
                input(type="file", @change="onFileChange($event)")

            .form-element
                label Active
                input(type="checkbox", v-model="form.active")

        .grid-item
            date-picker(:model="form.activeDates", :config="config")

    .middle
        label Properties
        .checkboxes
            .checkbox(v-for="(cb, key) in form.properties", :key="key")
                input(
                    type="checkbox",
                    v-model="form.properties[key]",
                    :id="key"
                )
                label(:for="key") {{ text(key) }}

    .bottom
        .toggle-hours(v-if="form.reservation !== undefined")
            label(for="reservation") Contact for details
            input#reservation(type="checkbox", v-model="form.reservation")

        .opening-hours(v-if="!form.reservation")
            label Opening hours
            .weekdays
                .weekday(v-for="(openingHours, day) in form.openingHours")
                    label {{ weekArray[day] }}

                    .items(v-for="(openingHour, index) in openingHours")
                        .item
                            label opens
                            input(type="time", v-model="openingHour.start")

                        .item
                            label closes
                            input(type="time", v-model="openingHour.end")

                        button.button(
                            v-if="index !== 0",
                            @click="removeOpeningHourSet(index, day)"
                        ) x

                    button.button(@click="addOpeningHourSet(day)") +

    .save
        button.button(@click="insert", :disabled="saveDisabled") save
</template>

<script>
import { db, storage } from "@/firebase/firebase";
import { ref, child, push } from "firebase/database";
import { mapState, mapGetters } from "vuex";
import datePicker from "@/components/DatePicker";
import deepmerge from "deepmerge";
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
            form: {},
            dates: "",
            key: this.$route.params.id,
            saveDisabled: false,
            uploadComplete: false,
            uploadProgess: 0,
        };
    },

    components: {
        datePicker,
    },

    computed: {
        ...mapState(["document", "loading", "weekArray"]),
        ...mapGetters(["isAdmin"]),

        collectionName() {
            return this.$route.meta.collection;
        },

        schema() {
            const schema = require(`@/assets/${this.collectionName}-schema.json`);
            return JSON.parse(JSON.stringify(schema));
        },

        activeDates: {
            get() {
                return this.form.activeDates ? this.form.activeDates : "";
            },
            set(val) {
                this.form.activeDates = val.split(", ").sort().join(", ");
            },
        },
    },

    mounted() {
        if (this.key !== undefined) {
            const overwriteMerge = (destinationArray, sourceArray, options) =>
                sourceArray;

            this.$store
                .dispatch("fetchDocument", {
                    collectionName: this.collectionName,
                    id: this.key,
                })
                .then(() => {
                    this.$set(
                        this,
                        "form",
                        deepmerge(this.schema, this.document, {
                            arrayMerge: overwriteMerge,
                        })
                    );
                    this.$store.commit("toggleLoading", false);
                });
        } else {
            this.$set(this, "form", this.schema);
            this.$store.commit("toggleLoading", false);
        }
    },

    methods: {
        addOpeningHourSet(day) {
            this.form.openingHours[day].push({ start: "", end: "" });
        },

        removeOpeningHourSet(index, day) {
            this.form.openingHours[day].splice(index, 1);
        },

        text(str) {
            return str.replace(/([A-Z])/g, (g) => ` ${g[0].toLowerCase()}`);
        },

        insert() {
            this.saveDisabled = true;

            if (!this.key) {
                this.key = push(child(ref(db), this.collectionName)).key;
                this.form.createdDate = utcToZonedTime(
                    new Date(),
                    "Asia/Makassar"
                );
            }

            let updates = {};
            updates[`/${this.collectionName}/` + this.key] = this.form;

            this.$store.dispatch("update", updates).then(() => {
                this.saveDisabled = false;
                if (!this.$route.params.id)
                    this.$router.push({ params: { id: this.key } });
            });
        },

        onFileChange(e) {
            let files = e.target.files;

            if (files.length) {
                files.forEach((file) => {
                    let storageRef = storage.ref(`logos/${file.name}`);
                    let task = storageRef.put(file);
                    task.on(
                        "state_changed",
                        (snapshot) => {
                            var percentage =
                                (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                100;
                            this.uploadProgress = percentage;
                        },
                        (err) => {
                            console.log("err", err);
                        },
                        () => {
                            task.snapshot.ref
                                .getDownloadURL()
                                .then((downloadURL) => {
                                    this.form.logo = downloadURL;
                                    this.uploadComplete = true;
                                });
                        }
                    );
                });
            }
        },
    },
};
</script>
