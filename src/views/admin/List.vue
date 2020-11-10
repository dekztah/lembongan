<template lang="pug">
  .admin-list
    .form
      input(type="text" v-model="search")
      | {{ filteredCollection.length }} results

      button.button(@click="addNew") add new {{ itemName }}

    .items
      .list-item(v-if="!loading" v-for="item in filteredCollection")
        .name {{ item.name }}
        router-link.button(:to="{ name: $route.meta.item, params: { id: item.key }}") edit

</template>

<script>
import { mapState } from "vuex";
import store from "@/store";

export default {
  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapState(["collections", "loading"]),
    collection() {
      return this.collections[this.$route.meta.collection];
    },
    itemName() {
      return this.$route.meta.item.toLowerCase();
    },
    filteredCollection() {
      return this.collection.filter(item =>
        this.search
          ? item.name.toLowerCase().includes(this.search.toLowerCase())
          : true
      );
    }
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch("fetchCollection", to.meta.collection).then(() => {
      next();
    });
  },
  methods: {
    addNew() {
      this.$router.push(`/admin/${this.itemName}`);
    }
  }
};
</script>
