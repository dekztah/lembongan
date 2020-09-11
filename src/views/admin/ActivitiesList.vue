<template lang="pug">
  .admin-activity-list.admin-list.main
    .form
      input(type="text" v-model="search")

    .activity.list-item(v-if="!loading" v-for="(activity, key) in activities")
      input(type="checkbox" v-model="activity.active")
      .name {{ activity.name }}
      router-link.button(:to="{ name: 'Activity', params: { id: key }}") edit

</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      search: "",
      activities: []
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  mounted() {
    db.ref("activities")
      .once("value")
      .then(snapshot => {
        this.activities = snapshot.val();
        this.$store.commit("toggleLoading", false);
      });
  }
};
</script>
