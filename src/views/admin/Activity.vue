<template lang="pug">
  .admin-form-activity(v-if="!loading")
    button.button(@click="reset") reset
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
        input(type="checkbox" v-model="form.yoga")
        label Yoga

      .checkbox
        input(type="checkbox" v-model="form.freediving")
        label Freediving

      .checkbox
        input(type="checkbox" v-model="form.scubaDiving")
        label Scuba diving

      .checkbox
        input(type="checkbox" v-model="form.surf")
        label Surf lessons

      .checkbox
        input(type="checkbox" v-model="form.spa")
        label Spa

      .checkbox
        input(type="checkbox" v-model="form.snorkeling")
        label Snorkeling

      .checkbox
        input(type="checkbox" v-model="form.fishing")
        label Fishing

      .checkbox
        input(type="checkbox" v-model="form.tour")
        label Tour

      .checkbox
        input(type="checkbox" v-model="form.miniGolf")
        label Mini golf

    .form-element
      .checkbox
        input(type="checkbox" v-model="form.reservation")
        label Reservation

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
import schema from "@/assets/activities-schema.json";

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
  created() {
    if (this.key !== undefined) {
      this.$store
        .dispatch("fetchDocument", {
          collectionName: "activities",
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
    reset() {
      this.form = {};
    },
    insert() {
      this.saveDisabled = true;
      this.key =
        this.key === undefined ? db.ref("activities").push().key : this.key;

      let updates = {};
      updates["/activities/" + this.key] = this.form;

      this.$store.dispatch("update", updates).then(() => {
        this.saveDisabled = false;
        if (!this.$route.params.id)
          this.$router.push({ params: { id: this.key } });
      });
    }
  }
};
</script>

<style lang="scss">
.admin-form-activity {
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
