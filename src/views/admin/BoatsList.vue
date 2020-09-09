<template lang="pug">
  .admin-boats-list.admin-list.main
    .boat.list-item(v-for="(boat, key) in boats")
      input(type="checkbox" v-model="boat.active")
      .name {{ boat.name }}
      router-link.button(:to="{ name: 'Boat', params: { id: key }}") edit

</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      boats: []
    };
  },
  mounted() {
    db.ref("boats")
      .once("value")
      .then(snapshot => {
        this.boats = snapshot.val();
        this.$store.commit("toggleLoading", false);
      });
  }
};
</script>
