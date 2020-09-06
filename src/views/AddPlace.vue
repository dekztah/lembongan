<template lang="pug">
  .add-place.main
    .form-element
      label Place name
      input(type="text" v-model="form.name")
    .form-element
      label Contact
      input(type="numner" v-model="form.contact")
    .form-element
      label Maps link
      input(type="text" v-model="form.gMapsLink")
    .form-element
      label Dine-in
      input(type="checkbox" v-model="form.dineIn")
    .form-element
      label Delivery
      input(type="checkbox" v-model="form.delivery")
    .form-element
      label Preorder
      input(type="checkbox" v-model="form.preorder")
    .form-element
      label Local dishes
      input(type="checkbox" v-model="form.localDishes")

    .form-element
      label Opening hours

      .x(v-for="(openingHour, index) in form.openingHours")
        label {{ weekArray[index] }}
        input(type="time" v-model="openingHour.start")
        input(type="time" v-model="openingHour.end")

    .form-element
      label Active
      input(type="checkbox" v-model="form.active")

    pre {{ form }}
    button(@click= "insert") insert

</template>

<script>
import { db } from "@/db";
import schema from "@/assets/places-schema.json";

export default {
  data() {
    return {
      form: schema
    };
  },
  computed: {
    weekArray() {
      return this.$store.state.weekArray;
    }
  },
  mounted() {
    this.$store.commit("toggleLoading", false);
  },
  methods: {
    insert() {
      let key = db.ref("places").push().key;

      let updates = {};
      updates["/places/" + key] = this.form;

      db.ref().update(updates);
    }
  }
};
</script>
