<template lang="pug">
  #app
    transition(name="fade")
      .loading(v-show="loading")
        .loader.blasting-ripple

    transition(name="fade")
      .wrapper(v-show="!loading" :class="{'mobile-nav-open': mobileNavOpen}")
        header(:class="{'admin-bar': userProfile.name }")
          .admin-header(v-if="userProfile.name")
            router-link.button(to="/admin/places-list") Places
            router-link.button(to="/admin/boats-list") Boats
            router-link.button(to="/admin/activities-list") Activities
            router-link.button(to="/admin/services-list") Services
            span {{ userProfile.name }}
            a.button(@click="logout") logout

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
            .current-page {{ $route.name }}

          .today
            h2 {{ dayOfTheWeek }}
            | {{ date }}
            br
            | {{ time }}

        router-view

        footer
          span.contact-me Incorrect data? Contact me on:&nbsp;
          a.wa(href="https://wa.me/6282144453436" target="_blank") WA

          a.kofi(href="https://ko-fi.com/dekztah" target="_blacnk")

</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["userProfile", "loading", "mobileNavOpen", "timestamp"]),
    showLogout() {
      return Object.keys(this.userProfile).length > 1;
    },
    dayOfTheWeek() {
      return this.timestamp.format("dddd");
    },
    date() {
      return this.timestamp.format("YYYY-MM-DD");
    },
    time() {
      return this.timestamp.format("HH:mm");
    },
    partOfTheDay() {
      let parts = ["pagi", "siang", "sore", "malam"];
      let time = this.$moment(this.time, "HH:mm");

      if (
        this.$moment(time, "HH:mm").isBetween(
          this.toMoment("4:00"),
          this.toMoment("9:59"),
          undefined,
          "[]"
        )
      ) {
        return parts[0];
      }

      if (
        this.$moment(time, "HH:mm").isBetween(
          this.toMoment("10:00"),
          this.toMoment("13:59"),
          undefined,
          "[]"
        )
      ) {
        return parts[1];
      }

      if (
        this.$moment(time, "HH:mm").isBetween(
          this.toMoment("14:00"),
          this.toMoment("18:29"),
          undefined,
          "[]"
        )
      ) {
        return parts[2];
      }

      return parts[3];
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
