<template lang="pug">
  #app
    transition(name="fade")
      .loading(v-show="loading")
        .loader.blasting-ripple

    transition(name="fade")
      .wrapper(v-show="!loading" :class="{'mobile-nav-open': mobileNavOpen}")
        header
          #nav-mobile
            .hamburger.hamburger--emphatic(type="button" @click="toggleMobileNav" :class="{'is-active': mobileNavOpen}")
              .hamburger-box
                .hamburger-inner

          #nav(:class="{'active': mobileNavOpen}")
            router-link(to="/food-and-drink") Food & Drink
            router-link(to="/boats") Boats
            router-link(to="/activities") Activities
            router-link(to="/services") Services


          .greeting
            h1 Selamat {{ partOfTheDay }}!

          .today
            h2 {{ dayOfTheWeek }}
            | {{ date }}
            br
            | {{ time }}


        router-view

        footer
          span Wrong data? Contact me on:&nbsp;
          a.wa(href="https://wa.me/6282144453436" target="_blank") WA
          a(v-if="userProfile.email" @click="logout") logout

</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["userProfile"]),
    showLogout() {
      return Object.keys(this.userProfile).length > 1;
    },
    mobileNavOpen() {
      return this.$store.state.mobileNavOpen;
    },
    dayOfTheWeek() {
      return this.$store.state.timestamp.format("dddd");
    },
    date() {
      return this.$store.state.timestamp.format("YYYY-MM-DD");
    },
    time() {
      return this.$store.state.timestamp.format("HH:mm");
    },
    loading() {
      return this.$store.state.loading;
    },
    partOfTheDay() {
      let parts = ["pagi", "siang", "sore", "malam"];

      let greeting;
      let time = this.$moment(this.time, "HH:mm");

      if (
        this.$moment(time, "HH:mm").isBetween(
          this.toMoment("0:00"),
          this.toMoment("11:59"),
          undefined,
          "[]"
        )
      ) {
        greeting = parts[0];
      }

      if (
        this.$moment(time, "HH:mm").isBetween(
          this.toMoment("12:00"),
          this.toMoment("14:59"),
          undefined,
          "[]"
        )
      ) {
        greeting = parts[1];
      }

      if (
        this.$moment(time, "HH:mm").isBetween(
          this.toMoment("15:00"),
          this.toMoment("18:29"),
          undefined,
          "[]"
        )
      ) {
        greeting = parts[2];
      }

      if (
        time.isBetween(
          this.$moment("18:30", "HH:mm"),
          this.$moment("23:59", "HH:mm"),
          undefined,
          "[]"
        )
      ) {
        greeting = parts[3];
      }

      return greeting;
    },
    devWidth() {
      return window.innerWidth;
    }
  },
  mounted() {
    setInterval(() => {
      this.$store.commit("updateTimeStamp");
    }, 30000);
  },
  methods: {
    toMoment(time) {
      return this.$moment(time, "HH:mm");
    },
    toggleMobileNav() {
      this.$store.commit("toggleMobileNav");
    },
    closeMobileNav() {
      this.$store.commit("closeMobileNav");
    },
    logout() {
      this.$store.dispatch("logout");
    }
  },
  watch: {
    $route(to, from) {
      if (from.name && from.name !== to.name) {
        this.closeMobileNav();
      }
    }
  }
};
</script>
