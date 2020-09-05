<template lang="pug">
  .contact.main
    | Contact me on whatsapp if you want to add your restaurant, or if you see mistakes in the data (like opening hours, wrong contact number etc.)
    a.wa(href="https://wa.me/6282144453436" target="_blank") WA
</template>

<script>
export default {
  mounted() {
    this.$store.commit('toggleLoading', false);
  },
};
</script>
