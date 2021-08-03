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
      if (this.name === "AC") return "ac";
      return this.name.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);
    },
    text() {
      if (this.name === "noPreorder") return "preorder";
      if (this.name === "AC") return "A/C";
      return this.name.replace(/([A-Z])/g, g => ` ${g[0].toLowerCase()}`);
    }
  }
};
</script>
