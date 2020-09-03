<template lang="pug">
  #app
    #nav
      router-link(to="/food-and-drink") Food and Drink
      router-link(to="/activities") Activities
      router-link(to="/boats") Boats

    .today Current date is: {{ timestamp }}
    router-view

</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    timestamp() {
      return this.$store.state.timestamp.format('dddd HH:mm YYYY-MM-DD');
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

#nav {
  a {
    margin-right: 10px;
  }
}
</style>
