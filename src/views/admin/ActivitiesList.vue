<template lang="pug">
  .admin-activity-list.admin-list
    .form
      input(type="text" v-model="search")
      | {{ filteredActivities.length }}

      button.button(@click="addNew") add new activity

    .activity.list-item(v-if="!loading" v-for="activity in filteredActivities")
      input(type="checkbox" v-model="activity.active")
      .name {{ activity.name }}
      router-link.button(:to="{ name: 'Activity', params: { id: activity.key }}") edit

</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapState(["activities"]),
    loading() {
      return this.$store.state.loading;
    },
    filteredActivities() {
      return this.activities.filter(activity =>
        this.search
          ? activity.name.toLowerCase().includes(this.search.toLowerCase())
          : true
      );
    }
  },
  created() {
    this.$store.dispatch("fetchCollection", "activities");
  },
  methods: {
    addNew() {
      this.$router.push("/admin/activity");
    }
  }
};
</script>
