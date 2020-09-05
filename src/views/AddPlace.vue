<template lang="pug">
  .add-place.main
    input(type="text" v-model="form.name")

</template>

<script>
import { db } from '@/db';
export default {
  data() {
    return {
      form: {
        name: null,
        openingHours: [
          'closed',
          'closed',
          'closed',
          'closed',
          [
            {
              start: '08:00',
              end: '15:00',
            },
          ],
          [
            {
              start: '12:00',
              end: '20:00',
            },
          ],
          'closed',
        ],
        dineIn: false,
        preorder: false,
        delivery: false,
        locallyOwned: false,
        contact: null,
      },
    };
  },
  mounted() {
    this.$store.commit('toggleLoading', false);
  },
  methods: {
    insert() {
      let key = db.ref('places').push().key;

      let updates = {};
      updates['/places/' + key] = this.formData;

      db.ref().update(updates);
    },
  },
};
</script>
