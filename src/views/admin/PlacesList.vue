<template lang="pug">
  .admin-place-list.admin-list.main
    .form
      input(type="text" v-model="search")

    .place.list-item(v-if="!loading" v-for="(place, key) in places")
      input(type="checkbox" v-model="place.active")
      .name {{ place.name }}
      router-link.button(:to="{ name: 'Place', params: { id: key }}") edit

</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      search: "",
      places: []
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    filteredPlaces() {
      console.log("m", this.places);
      return this.places.filter(place =>
        this.search
          ? place.name.toLowerCase().includes(this.search.toLowerCase())
          : true
      );
    }
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
