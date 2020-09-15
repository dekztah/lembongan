<template lang="pug">
  .admin.main
    router-link.button(to="/admin/places-list") Places
    router-link.button(to="/admin/boats-list") Boats
    router-link.button(to="/admin/activities-list") Activities
    router-link.button(to="/admin/services-list") Services

    router-view
</template>
<script>
export default {
  mounted() {
    this.$store.commit("toggleLoading", false);
  }
};
</script>
