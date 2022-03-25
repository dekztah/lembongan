<template lang="pug">
  .tile.accomodation-tile(
    :class="{ 'double': isDouble, 'reservation': reservation, 'new': item.new }"
  )
    .content
      img.main-image(v-if="item.images" :src="item.images.main")

      h2.name(v-if="!item.logo || item.sponsored === 0") {{ item.name }}
      .type {{ item.type }}

      .info
        chip(
          v-if="chipVisible(item.properties, key)"
          v-for="(cb, key) in filters"
          :key="`chip-${key}`"
          :name="key"
        )

      router-link.more(:to="{ name: 'Accomodation', params: { id: item.key }}") More details ...

    .highlight(v-if="item.new") NEW

</template>
<script>
import { mapState } from "vuex";
import chip from "@/components/Chip";
import generic from "@/mixins/generic";

export default {
    data() {
        return {
            isDouble: true,
            reservation: true,
        };
    },

    components: {
        chip,
    },

    props: {
        item: Object,
    },

    mixins: [generic],

    computed: {
        ...mapState(["filters"]),
    },

    mounted() {},

    methods: {
        chipVisible(item, key) {
            return item[key];
        },

        waUrl(contact) {
            return `https://wa.me/${contact}`;
        },
    },
};
</script>

<style lang="scss">
.accomodation-tile {
    .content {
        img.main-image {
            margin: -16px -16px 16px;
            border-radius: 4px 4px 0 0;
        }

        .info {
            margin-top: 10px;
        }
    }

    .more {
        margin-top: 16px;
    }
}
</style>
