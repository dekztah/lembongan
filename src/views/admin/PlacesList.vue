<template lang="pug">
  .admin-place-list.main
    .place(v-for="(place, key) in places")
      input(type="checkbox" v-model="place.active")
      .name {{ place.name }}
      router-link.button(:to="{ name: 'Place', params: { id: key }}") edit

</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      places: []
    };
  },
  mounted() {
    db.ref("places")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(child => {
          this.places.push(child.val());
        });
        this.$store.commit("toggleLoading", false);
      });
  }
};
</script>

<style lang="scss">
.admin-place-list {
  padding: 10px;

  .place {
    padding: 10px;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
