<template lang="pug">
  .admin-boats-list.admin-list
    .form
      input(type="text" v-model="search")
      | {{ filteredBoats.length }}

      button.button(@click="addNew") add new boat

    .boat.list-item(v-for="boat in filteredBoats")
      input(type="checkbox" v-model="boat.active")
      .name {{ boat.name }}
      router-link.button(:to="{ name: 'Boat', params: { id: boat.key }}") edit

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
    ...mapState(["collections"]),
    loading() {
      return this.$store.state.loading;
    },
    filteredBoats() {
      return this.collections.boats.filter(boat =>
        this.search
          ? boat.name.toLowerCase().includes(this.search.toLowerCase())
          : true
      );
    }
  },
  created() {
    this.$store.dispatch("fetchCollection", "boats");
  },
  methods: {
    addNew() {
      this.$router.push("/admin/boat");
    }
  }
};
</script>
