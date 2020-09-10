<template lang="pug">
  .login.main
    .form
      input.text-input(type="email" v-model="form.email")
      input.text-input(type="password" v-model="form.password")

    button.button(@click="login") login
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  mounted() {
    this.$store.commit("toggleLoading", false);
  },
  methods: {
    login() {
      this.$store.dispatch("login", {
        email: this.form.email,
        password: this.form.password
      });
    }
  }
};
</script>
<style lang="scss"></style>
