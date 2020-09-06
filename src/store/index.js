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
    toggleLoading(state, bool) {
      state.loading = bool;
    }
  },
  actions: {
    async login({ dispatch }, form) {
      console.log("fasz", form);
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      dispatch("fetchUserProfile", user);
    },
    async fetchUserProfile({ commit }, user) {
      const userProfile = await fb.usersCollection.doc(user.uid).get();

      commit("setUserProfile", userProfile.data());

      router.push("/");
    }
  },
  modules: {}
});
