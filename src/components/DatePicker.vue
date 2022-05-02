<template lang="pug">
input(v-model="model")
</template>

<script>
import flatpickr from "flatpickr";

export default {
    props: {
        model: {
            type: String,
        },
        config: {
            type: Object,
        },
    },

    mounted() {
        flatpickr(this.$el, this.config);
    },
};
</script>
