<template lang="pug">
  .admin-service-list.admin-list
    .form
      input(type="text" v-model="search")
      | {{ filteredServices.length }}

      button.button(@click="addNew") add new service

    .service.list-item(v-if="!loading" v-for="service in filteredServices")
      input(type="checkbox" v-model="service.active")
      .name {{ service.name }}
      router-link.button(:to="{ name: 'Service', params: { id: service.key }}") edit

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
    ...mapState(["services"]),
    loading() {
      return this.$store.state.loading;
    },
    filteredServices() {
      return this.services.filter(service =>
        this.search
          ? service.name.toLowerCase().includes(this.search.toLowerCase())
          : true
      );
    }
  },
  created() {
    this.$store.dispatch("fetchServices");
  },
  methods: {
    addNew() {
      this.$router.push("/admin/service");
    }
  }
};
</script>
