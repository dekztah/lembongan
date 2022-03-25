<template lang="pug">
  .filter.checkbox
    input(type="checkbox" :id="name" :checked="filters[name]" @change="onInput")
    label(:class="[{'chip': filters[name]}, className]" :for="name") {{ text }}

</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
    props: {
        name: String,
        tags: Array,
        open: String,
    },
    computed: {
        ...mapState(["filters"]),
        className() {
            if (this.name === "AC") return "ac";
            return this.name.replace(
                /([A-Z])/g,
                (g) => `-${g[0].toLowerCase()}`
            );
        },
        text() {
            if (this.name === "AC") return "A/C";
            return this.name.replace(
                /([A-Z])/g,
                (g) => ` ${g[0].toLowerCase()}`
            );
        },
    },
    mounted() {
        if (this.tags && this.tags.includes(this.name)) {
            this.setFilter({ key: this.name, val: true });
        }
        if (this.open) {
            this.setFilter({ key: "openNow", val: true });
        }
    },
    methods: {
        ...mapActions(["setFilter"]),
        onInput(e) {
            this.$emit("input", e.target.checked);
        },
    },
};
</script>
