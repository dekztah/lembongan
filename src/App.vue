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
          a.social.wa(href="https://wa.me/6282144453436" target="_blank" rel="noopener") WA

          a.kofi(href="https://ko-fi.com/dekztah" target="_blank" rel="noopener")

</template>

<script>
import { mapState, mapActions } from "vuex";
import { format, isWithinInterval, parse } from "date-fns";

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
      return format(this.timestamp, "EEEE");
    },
    date() {
      return format(this.timestamp, "yyyy-MM-dd");
    },
    time() {
      return format(this.timestamp, "HH:mm");
    },
    partOfTheDay() {
      let parts = ["pagi", "siang", "sore", "malam"];

      if (
        isWithinInterval(this.timestamp, {
          start: this.parseTime("4:00"),
          end: this.parseTime("10:00")
        })
      ) {
        return parts[0];
      }

      if (
        isWithinInterval(this.timestamp, {
          start: this.parseTime("10:00"),
          end: this.parseTime("14:00")
        })
      ) {
        return parts[1];
      }

      if (
        isWithinInterval(this.timestamp, {
          start: this.parseTime("14:00"),
          end: this.parseTime("18:30")
        })
      ) {
        return parts[2];
      }

      return parts[3];
    }
  },
  mounted() {
    setInterval(() => {
      this.updateTimeStamp();
    }, 30000);
  },
  methods: {
    ...mapActions([
      "toggleMobileNav",
      "logout",
      "closeMobileNav",
      "updateTimeStamp"
    ]),
    parseTime(time) {
      return parse(time, "HH:mm", new Date());
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
