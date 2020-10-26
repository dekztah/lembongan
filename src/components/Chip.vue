<template lang="pug">
  .chip(:class="className") {{ text }}

</template>
<script>
export default {
  props: {
    name: String
  },
  computed: {
    className() {
      if (this.name === "noPreorder") return "preorder";
      return this.name.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);
    },
    text() {
      if (this.name === "noPreorder") return "preorder";
      return this.name.replace(/([A-Z])/g, g => ` ${g[0].toLowerCase()}`);
    }
  }
};
</script>
