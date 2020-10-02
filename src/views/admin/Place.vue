<template lang="pug">
  .admin-form.admin-form-place
    .form-element
      label Place name
      input(type="text" v-model="form.name")

    .form-element
      label Contact
      input(type="number" v-model="form.contact")

    .form-element
      label Maps link
      input(type="text" v-model="form.gMapsLink")

    .form-element
      label Facebook link
      input(type="text" v-model="form.facebookLink")

    .form-element
      label Instagram link
      input(type="text" v-model="form.instagramLink")

    .form-element.checkboxes
      .checkbox
        input(type="checkbox" v-model="form.dineIn")
        label Dine-in

      .checkbox
        input(type="checkbox" v-model="form.delivery")
        label Delivery

      .checkbox
        input(type="checkbox" v-model="form.preorder")
        label Preorder

      .checkbox
        input(type="checkbox" v-model="form.localDishes")
        label Local dishes

      .checkbox
        input(type="checkbox" v-model="form.coffee")
        label Coffee

      .checkbox
        input(type="checkbox" v-model="form.rendang")
        label Rendang

      .checkbox
        input(type="checkbox" v-model="form.desserts")
        label Desserts

      .checkbox
        input(type="checkbox" v-model="form.drinks")
        label Drinks

    .form-element
      label Opening hours

      .weekdays

        .weekday(v-for="(openingHours, day) in form.openingHours")
          label {{ weekArray[day] }}
          button.button(@click="addOpeningHourSet(day)") +

          .form-element(v-for="(openingHour, index) in openingHours")
            .items
              .item
                label opens
                input(type="time" v-model="openingHour.start")

              .item
                label closes
                input(type="time" v-model="openingHour.end")

            button.button(v-if="index !== 0" @click="removeOpeningHourSet(index, day)") x

    .form-element
      label Active
      input(type="checkbox" v-model="form.active")

    button.button(@click= "insert" :disabled="saveDisabled") save

</template>

<script>
import { db } from "@/firebase";
import { mapState } from "vuex";
import schema from "@/assets/places-schema.json";

export default {
  data() {
    return {
      form: schema,
      key: this.$route.params.id,
      saveDisabled: false
    };
  },
  computed: {
    ...mapState(["document"]),
    loading() {
      return this.$store.state.loading;
    },
    weekArray() {
      return this.$store.state.weekArray;
    }
  },
  mounted() {
    if (this.key !== undefined) {
      this.$store
        .dispatch("fetchDocument", {
          collectionName: "places",
          id: this.key
        })
        .then(() => {
          this.$set(this, "form", this.document);
        });
    } else {
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
    insert() {
      this.saveDisabled = true;
      this.key =
        this.key === undefined ? db.ref("places").push().key : this.key;

      let updates = {};
      updates["/places/" + this.key] = this.form;

      this.$store.dispatch("update", updates).then(() => {
        this.saveDisabled = false;
        if (!this.$route.params.id)
          this.$router.push({ params: { id: this.key } });
      });
    }
  }
};
</script>
