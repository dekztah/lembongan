<template lang="pug">
  .login.main
    input(type="email" v-model="form.email")
    input(type="password" v-model="form.password")

    button(@click="login") login
</template>

<script>
// import { auth } from "@/firebase";
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
