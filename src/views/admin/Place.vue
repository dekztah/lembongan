<template lang="pug">
  .admin-form-place.main
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
        input(type="checkbox" v-model="form.drinks")
        label Drinks

    .form-element
      label Opening hours

      .weekdays

        .weekday(v-for="(openingHours, day) in form.openingHours")
          label {{ weekArray[day] }}
          button.button(@click="addOpeningHourSet(day)") +

          //- pre {{ openingHours }}
          //- .y(v-for="openingHour in openingHours")
          //-   | {{ openingHour }}

          .form-element(v-for="(openingHour, index) in openingHours")
            .items
              .item
                label opens
                input(type="time" v-model="openingHour.start")

              .item
                label closes
                input(type="time" v-model="openingHour.end")

            button.button(@click="removeOpeningHourSet(index, day)") x

    .form-element
      label Active
      input(type="checkbox" v-model="form.active")

    button.button(@click= "insert" :disabled="saveDisabled") save

</template>

<script>
import { db } from "@/firebase";
import schema from "@/assets/places-schema.json";

export default {
  data() {
    return {
      form: schema,
      key: null,
      saveDisabled: false
    };
  },
  computed: {
    weekArray() {
      return this.$store.state.weekArray;
    }
  },
  mounted() {
    if (this.$route.params.id !== undefined) {
      db.ref(`places/${this.$route.params.id}`)
        .once("value")
        .then(snapshot => {
          this.form = snapshot.val();
          this.key = snapshot.key;
        });
    }
    this.$store.commit("toggleLoading", false);
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
      this.key = this.key === null ? db.ref("places").push().key : this.key;

      let updates = {};
      updates["/places/" + this.key] = this.form;

      db.ref().update(updates, error => {
        console.log("error", error);
        this.saveDisabled = false;
        this.$router.push("/admin/places-list");
      });
    }
  }
};
</script>

<style lang="scss">
.admin-form-place {
  padding: 10px;

  .form-element {
    padding: 10px;

    label {
      display: block;
      font-size: 12px;
    }
    input[type="text"],
    input[type="number"],
    input[type="time"] {
      padding: 10px;
      border: none;
      border-radius: 4px;
    }

    input[type="text"],
    input[type="number"] {
      width: 300px;
    }

    &.checkboxes {
      label {
        display: inline;
      }
      display: flex;
    }
  }
  .weekdays {
    display: flex;

    .weekday {
      flex: 1;
      padding: 10px;

      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        padding-right: 0;
      }

      &:not(:last-child) {
        border-right: 1px solid black;
      }

      .form-element {
        padding: 0;
        display: flex;

        .item {
          margin-right: 4px;
        }
        button {
          flex: 1;
        }
      }
    }
  }
}
</style>
