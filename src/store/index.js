import Vue from "vue";
import Vuex from "vuex";
import VueMoment from "vue-moment";

Vue.use(Vuex);
Vue.use(VueMoment);

const currentTime = Vue.moment();

export default new Vuex.Store({
  state: {
    timestamp: currentTime,
    weekArray: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    mobileNavOpen: false,
    loading: true
  },
  mutations: {
    updateTimeStamp(state) {
      state.timestamp = Vue.moment();
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    toggleLoading(state, bool) {
      state.loading = bool;
    }
  },
  actions: {},
  modules: {}
});
