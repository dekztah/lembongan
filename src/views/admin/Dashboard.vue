<template lang="pug">
  .dashboard.admin-form
    template(v-if="isAdmin")
      .lists
        .links
          router-link.button(to="/admin/places-list") Places
          router-link.button(to="/admin/boats-list") Boats
          router-link.button(to="/admin/activities-list") Activities
          router-link.button(to="/admin/services-list") Services

      .add
        .links
          router-link.button(to="/admin/place") + new place
          router-link.button(to="/admin/boat") + new boat
          router-link.button(to="/admin/activity") + new activity
          router-link.button(to="/admin/service") + new service

    template(v-else)
      | test card {{ userProfile.ownerOf }}
      .link(v-for="place in userProfile.ownerOf.places")
        router-link.button(:to="`/admin/place/${place}`")

</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/firebase/firebase";

export default {
  computed: {
    ...mapGetters(["isAdmin", "userProfile"])
  },

  mounted() {
    console.log("ff", this.userProfile);
    for (let type in this.userProfile.ownerOf) {
      console.log("yy", type);
    }
    db.ref("places/18/name")
      .once("value")
      .then(snapshot => {
        console.log("x", snapshot.val());
      });
  }
};
</script>
