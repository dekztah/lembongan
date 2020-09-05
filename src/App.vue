<template lang="pug">
  #app
    transition(name="fade")
      .loading(v-show="loading")
        .loader.blasting-ripple

    transition(name="fade")
      .wrapper(v-show="!loading")
        header
          #nav-mobile
            .hamburger.hamburger--emphatic(type="button" @click="toggleMobileNav" :class="{'is-active': mobileNavOpen}")
              .hamburger-box
                .hamburger-inner

          #nav(:class="{'active': mobileNavOpen}")
            router-link(to="/food-and-drink") Food and Drink
            router-link(to="/activities") Activities
            router-link(to="/boats") Boats
            //- router-link(to="/contact") Contact

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

</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    mobileNavOpen() {
      return this.$store.state.mobileNavOpen;
    },
    dayOfTheWeek() {
      return this.$store.state.timestamp.format('dddd');
    },
    date() {
      return this.$store.state.timestamp.format('YYYY-MM-DD');
    },
    time() {
      return this.$store.state.timestamp.format('HH:mm');
    },
    loading() {
      return this.$store.state.loading;
    },
    partOfTheDay() {
      let parts = ['pagi', 'siang', 'sore', 'malam'];

      let greeting;
      let time = this.$moment(this.time, 'HH:mm');

      if (
        this.$moment(time, 'HH:mm').isBetween(
          this.toMoment('0:00'),
          this.toMoment('11:59')
        )
      ) {
        greeting = parts[0];
      }

      if (
        this.$moment(time, 'HH:mm').isBetween(
          this.toMoment('12:00'),
          this.toMoment('14:59')
        )
      ) {
        greeting = parts[1];
      }

      if (
        this.$moment(time, 'HH:mm').isBetween(
          this.toMoment('15:00'),
          this.toMoment('18:29')
        )
      ) {
        greeting = parts[2];
      }

      if (
        time.isBetween(
          this.$moment('18:30', 'HH:mm'),
          this.$moment('23:59', 'HH:mm')
        )
      ) {
        greeting = parts[3];
      }

      return greeting;
    },
    devWidth() {
      return window.innerWidth;
    },
  },
  mounted() {
    setInterval(() => {
      this.$store.commit('updateTimeStamp');
    }, 30000);
  },
  methods: {
    toMoment(time) {
      return this.$moment(time, 'HH:mm');
    },
    toggleMobileNav() {
      this.$store.commit('toggleMobileNav');
    },
  },
  watch: {
    $route(to, from) {
      if (from.name) {
        this.toggleMobileNav();
      }
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');

* {
  box-sizing: border-box;
}
body {
  background: #92e6ff;
  margin: 0;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

header {
  position: fixed;
  z-index: 1;
  width: 100%;
  top: 0;
  height: 85px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);

  @media only screen and (max-width: 575px) {
    .greeting {
      h1 {
        font-size: 20px;
      }
    }

    .today {
      font-size: 12px;
      h2 {
        font-size: 16px;
      }
    }
  }
  #nav {
    flex: 1;

    a {
      margin-right: 10px;
      display: inline-block;
      border-radius: 4px;
      padding: 2px 8px;
      background: darken(#92e6ff, 20);
      color: white;
      text-decoration: none;

      &.router-link-active {
        background: darken(#92e6ff, 40);
      }
    }
    @media only screen and (max-width: 575px) {
      transform: translateX(-575px);
      position: fixed;
      background: white;
      top: 85px;
      transition: transform 0.3s ease-out;
      width: 100%;
      padding: 10px;

      &.active {
        transform: translateX(-10px);
      }
    }
  }
  .greeting {
    flex: 1;

    h1 {
      text-align: center;
      margin: 0;
    }
  }
  .today {
    flex: 1;
    text-align: right;
    h2 {
      margin: 0;
    }
  }
  #nav-mobile {
    display: none;

    @media only screen and (max-width: 575px) {
      margin-left: -15px;
      flex: 1;
      display: block;
    }
  }
}
.main {
  margin-top: 130px;
  margin-bottom: 52px;
  @media only screen and (max-width: 575px) {
    margin-top: 85px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  background: darken(#92e6ff, 60);
  color: white;
  padding: 10px;
}
</style>
