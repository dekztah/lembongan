import Vue from "vue";
import Vuex from "vuex";
import VueMoment from "vue-moment";
import * as fb from "../firebase";
import router from "../router/index";

Vue.use(Vuex);
Vue.use(VueMoment);

const currentTime = Vue.moment();

export default new Vuex.Store({
  state: {
    timestamp: currentTime,
    weekArray: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    mobileNavOpen: false,
    loading: true,
    userProfile: {}
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    updateTimeStamp(state) {
      state.timestamp = Vue.moment();
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    closeMobileNav(state) {
      state.mobileNavOpen = false;
    },
    toggleLoading(state, bool) {
      state.loading = bool;
    }
  },
  actions: {
    async login({ commit }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      commit("setUserProfile", user);
      router.push("/admin");
    },
    async logout({ commit }) {
      await fb.auth.signOut();

      commit("setUserProfile", {});
      router.push("/login");
    }
  },
  modules: {}
});
