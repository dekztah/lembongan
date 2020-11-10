<template lang="pug">
  .admin-form
    .top
      .grid-item
        .form-element
          label Name
          input(type="text" v-model="form.name")

        .form-element
          label Facebook link
          input(type="text" v-model="form.facebookLink")

        .form-element
          label Instagram link
          input(type="text" v-model="form.instagramLink")

      .grid-item
        .form-element
          label Active
          input(type="checkbox" v-model="form.active")

        .form-element
          label Contact
          input(type="number" v-model="form.contact")

        .form-element
          label Maps link
          input(type="text" v-model="form.gMapsLink")

    .middle
      label Properties
      .checkboxes
        .checkbox(v-for="(cb,key) in form.properties")
          input(type="checkbox" :checked="cb" :id="key")
          label(:for="key") {{ text(key) }}

    .bottom
      .toggle-hours(v-if="form.reservation !== undefined")
        label(for="reservation") Contact for details
        input(type="checkbox" v-model="form.reservation" id="reservation")

      .opening-hours(v-if="!form.reservation")
        label Opening hours
        .weekdays
          .weekday(v-for="(openingHours, day) in form.openingHours")
            label {{ weekArray[day] }}

            .items(v-for="(openingHour, index) in openingHours")
              .item
                label opens
                input(type="time" v-model="openingHour.start")

              .item
                label closes
                input(type="time" v-model="openingHour.end")

              button.button(v-if="index !== 0" @click="removeOpeningHourSet(index, day)") x

            button.button(@click="addOpeningHourSet(day)") +

    .save
      button.button(@click= "insert" :disabled="saveDisabled") save

</template>

<script>
import { db } from "@/firebase/firebase";
import { mapState } from "vuex";
import placesSchema from "@/assets/places-schema.json";
import servicesSchema from "@/assets/services-schema.json";
import activitiesSchema from "@/assets/activities-schema.json";

export default {
  data() {
    return {
      schemas: {
        placesSchema,
        servicesSchema,
        activitiesSchema
      },
      form: [],
      key: this.$route.params.id,
      saveDisabled: false
    };
  },
  computed: {
    ...mapState(["document", "loading", "weekArray"]),
    collectionName() {
      return this.$route.meta.collection;
    }
  },
  mounted() {
    if (this.key !== undefined) {
      this.$store
        .dispatch("fetchDocument", {
          collectionName: this.collectionName,
          id: this.key
        })
        .then(() => {
          this.$set(this, "form", this.document);
        });
    } else {
      this.form = this.schemas[`${this.collectionName}Schema`];
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
      return str.replace(/([A-Z])/g, g => ` ${g[0].toLowerCase()}`);
    },
    insert() {
      this.saveDisabled = true;
      this.key =
        this.key === undefined
          ? db.ref(this.collectionName).push().key
          : this.key;

      let updates = {};
      updates[`/${this.collectionName}/` + this.key] = this.form;

      this.$store.dispatch("update", updates).then(() => {
        this.saveDisabled = false;
        if (!this.$route.params.id)
          this.$router.push({ params: { id: this.key } });
      });
    }
  }
};
</script>
