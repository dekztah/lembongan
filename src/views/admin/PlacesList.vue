<template lang="pug">
  .admin-place-list.admin-list.main
    .place.list-item(v-for="(place, key) in places")
      input(type="checkbox" v-model="place.active")
      .name {{ place.name }}
      router-link.button(:to="{ name: 'Place', params: { id: key }}") edit

</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      places: []
    };
  },
  mounted() {
    db.ref("places")
      .once("value")
      .then(snapshot => {
        this.places = snapshot.val();
        this.$store.commit("toggleLoading", false);
      });
  }
};
</script>
