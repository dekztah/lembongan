<template lang="pug">
  .dashboard.admin-form
    template(v-if="isAdmin")
      .lists
        .links
          router-link.button(to="/admin/places-list") Places
          router-link.button(to="/admin/boats-list") Boats
          router-link.button(to="/admin/activities-list") Activities
          router-link.button(to="/admin/services-list") Services
          router-link.button(to="/admin/accomodations-list") Accomodations

      .add
        .links
          router-link.button(to="/admin/place") + new place
          router-link.button(to="/admin/boat") + new boat
          router-link.button(to="/admin/activity") + new activity
          router-link.button(to="/admin/service") + new service
          router-link.button(to="/admin/accomodation") + new accomodation

</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters(["isAdmin", "userProfile"]),
    },
};
</script>
