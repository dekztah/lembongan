<template lang="pug">
  .admin-place-list.admin-list
    .form
      input(type="text" v-model="search")
      | {{ filteredPlaces.length }}

      button.button(@click="addNew") add new place

    .place.list-item(v-if="!loading" v-for="place in filteredPlaces")
      input(type="checkbox" v-model="place.active")
      .name {{ place.name }}
      router-link.button(:to="{ name: 'Place', params: { id: place.key }}") edit

</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapState(["places"]),
    loading() {
      return this.$store.state.loading;
    },
    filteredPlaces() {
      return this.places.filter(place =>
        this.search
          ? place.name.toLowerCase().includes(this.search.toLowerCase())
          : true
      );
    }
  },
  created() {
    this.$store.dispatch("fetchCollection", "places");
  },
  methods: {
    addNew() {
      this.$router.push("/admin/place");
    }
  }
};
</script>
