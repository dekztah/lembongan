<template lang="pug">
  .admin-boats-list.main
    .boat(v-for="(boat, key) in boats")
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
        snapshot.forEach(child => {
          this.boats.push(child.val());
        });
        this.$store.commit("toggleLoading", false);
      });
  }
};
</script>

<style lang="scss">
.admin-boat-list {
  padding: 10px;

  .boat {
    padding: 10px;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
