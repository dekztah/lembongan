<template lang="pug">
  .admin.main
    router-link(to="admin/places-list") Places
    router-link(to="admin/boats-list") Boats
    router-link(to="admin/activities-list") Activities
    router-link(to="admin/services-list") Services

    router-view
</template>
<script>
export default {
  mounted() {
    this.$store.commit("toggleLoading", false);
  }
};
</script>
