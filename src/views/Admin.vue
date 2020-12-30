<template lang="pug">
  .admin.main
    router-view

</template>
<script>
export default {
  mounted() {
    this.$store.commit("toggleLoading", false);
  }
};
</script>
