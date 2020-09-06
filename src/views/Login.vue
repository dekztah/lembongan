<template lang="pug">
  .login.main
    input(type="email" v-model="form.email")
    input(type="password" v-model="form.password")

    button(@click="login") login
</template>

<script>
// import firebase from "firebase";
import { fb } from "@/db";
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
      fb.auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          console.log("x", data);
          this.$router.replace({ name: "AddPlace" });
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  }
};
</script>
