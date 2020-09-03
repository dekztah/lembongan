<template lang="pug">
  #app
    header
      #nav
        router-link(to="/food-and-drink") Food and Drink
        router-link(to="/activities") Activities
        router-link(to="/boats") Boats

      .greeting
        h1 Selamat {{ partOfTheDay }}!

      .today
        h2 {{ dayOfTheWeek }}
        | {{ date }}
        br
        | {{ time }}

    router-view

</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    dayOfTheWeek() {
      return this.$store.state.timestamp.format('dddd');
    },
    date() {
      return this.$store.state.timestamp.format('YYYY-MM-DD');
    },
    time() {
      return this.$store.state.timestamp.format('HH:mm');
    },
    partOfTheDay() {
      let teszt = ['pagi', 'siang', 'sore', 'malam'];

      let lofasz;
      let time = this.$moment(this.time, 'HH:mm');

      if (
        this.$moment(time, 'HH:mm').isBetween(
          this.toMoment('5:00'),
          this.toMoment('12:00')
        )
      ) {
        lofasz = teszt[0];
      }

      if (
        this.$moment(time, 'HH:mm').isBetween(
          this.toMoment('12:00'),
          this.toMoment('15:00')
        )
      ) {
        lofasz = teszt[1];
      }

      if (
        this.$moment(time, 'HH:mm').isBetween(
          this.toMoment('15:00'),
          this.toMoment('18:00')
        )
      ) {
        lofasz = teszt[2];
      }

      if (
        time.isBetween(
          this.$moment('18:00', 'HH:mm'),
          this.$moment('23:59', 'HH:mm')
        )
      ) {
        lofasz = teszt[3];
      }

      return lofasz;
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
  padding: 10px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  + * {
    margin-top: 85px;
  }
}

#nav {
  a {
    margin-right: 10px;
  }
}
.today {
  text-align: right;
  h2 {
    margin: 0;
  }
}
</style>
