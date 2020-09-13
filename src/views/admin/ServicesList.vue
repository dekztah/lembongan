<template lang="pug">
  .admin-service-list.admin-list.main
    .form
      input(type="text" v-model="search")

      button.button(@click="addNew") add new service

    .service.list-item(v-if="!loading" v-for="(service, key) in services")
      input(type="checkbox" v-model="service.active")
      .name {{ service.name }}
      router-link.button(:to="{ name: 'Service', params: { id: key }}") edit

</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      search: "",
      services: []
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  mounted() {
    db.ref("services")
      .once("value")
      .then(snapshot => {
        this.services = snapshot.val();
        this.$store.commit("toggleLoading", false);
      });
  },
  methods: {
    addNew() {
      this.$router.push("/admin/service");
    }
  }
};
</script>
