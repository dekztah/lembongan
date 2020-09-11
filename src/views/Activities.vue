<template lang="pug">
  .activities.main
    .activity-list
      .activity(v-for="activity in activities")
        pre {{ activity }}

</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      activities: []
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    mobileNavOpen() {
      return this.$store.state.mobileNavOpen;
    },
    timestamp() {
      return this.$store.state.timestamp;
    }
  },
  mounted() {
    db.ref("activities")
      .orderByChild("name")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(child => {
          this.activities.push(child.val());
        });
        this.$store.commit("toggleLoading", false);
        // this.setIsOpen();
      });
  }
};
</script>
