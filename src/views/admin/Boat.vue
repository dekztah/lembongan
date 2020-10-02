<template lang="pug">
  .admin-form-boats
    .form-element
      label Boat company name
      input(type="text" v-model="form.name")

    .form-element
      label Contact
      input(type="number" v-model="form.contact")

    .form-element
      label Maps link
      input(type="text" v-model="form.gMapsLink")

    .form-element
      label Lembongan departure location
      input(type="text" v-model="form.lembonganLocation")

    .form-element
      label To Sanur

      .weekdays
        .weekday(v-for="(departure, day) in form.departToSanur" :key="`departure${day}${form.departToSanur.length}`")
          label {{ weekArray[day] }}
          button.button(@click="addDepartureTime('departToSanur', day)") +

          .x(v-for="(depTime, index) in departure")
            input(type="time" v-model="form.departToSanur[day][index]")
            button.button(v-if="index !== 0" @click="removeDepartureTime('departToSanur', index, day)") x

    .form-element
      label To Lembongan

      .weekdays
        .weekday(v-for="(departure, day) in form.departToLembongan")
          label {{ weekArray[day] }}
          button.button(@click="addDepartureTime('departToLembongan', day)") +

          .x(v-for="(depTime, index) in departure")
            input(type="time" v-model="form.departToLembongan[day][index]")
            button.button(v-if="index !== 0" @click="removeDepartureTime('departToLembongan', index, day)") x

    .form-element
      label Active
      input(type="checkbox" v-model="form.active")

    button.button(@click= "insert" :disabled="saveDisabled") save

</template>

<script>
import { db } from "@/firebase";
import { mapState } from "vuex";
import schema from "@/assets/boats-schema.json";

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
          collectionName: "boats",
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
    addDepartureTime(destination, day) {
      this.form[destination][day].push("");
    },
    removeDepartureTime(destination, index, day) {
      this.form[destination][day].splice(index, 1);
    },
    insert() {
      this.saveDisabled = true;
      this.key = this.key === undefined ? db.ref("boats").push().key : this.key;

      let updates = {};
      updates["/boats/" + this.key] = this.form;

      this.$store.dispatch("update", updates).then(() => {
        this.saveDisabled = false;
        if (!this.$route.params.id)
          this.$router.push({ params: { id: this.key } });
      });
    }
  }
};
</script>
