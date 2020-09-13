import Vue from "vue";
import Vuex from "vuex";
import VueMoment from "vue-moment";
import { auth, db } from "@/firebase";
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
    userProfile: {},
    places: [],
    activities: [],
    services: [],
    boats: []
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
    },
    setPlaces(state, val) {
      state.places = val;
    },
    setActivities(state, val) {
      state.activities = val;
    },
    setBoats(state, val) {
      state.boats = val;
    },
    setServices(state, val) {
      state.services = val;
    }
  },
  actions: {
    async login({ commit }, form) {
      const { user } = await auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      commit("setUserProfile", user);
      router.push("/admin");
    },
    async logout({ commit }) {
      await auth.signOut();

      commit("setUserProfile", {});
      router.push("/login");
    },
    async fetchPlaces({ commit, state }) {
      let places = [];

      if (!state.places.length) {
        db.ref("places")
          .orderByChild("name")
          .once("value")
          .then(snapshot => {
            snapshot.forEach(child => {
              places.push(child.val());
            });
            commit("toggleLoading", false);
          });

        commit("setPlaces", places);
      }
    },
    async fetchActivities({ commit, state }) {
      let activities = [];

      if (!state.activities.length) {
        db.ref("activities")
          .orderByChild("name")
          .once("value")
          .then(snapshot => {
            snapshot.forEach(child => {
              activities.push(child.val());
            });
            commit("toggleLoading", false);
          });

        commit("setActivities", activities);
      }
    },
    async fetchServices({ commit, state }) {
      let services = [];

      if (!state.services.length) {
        db.ref("services")
          .orderByChild("name")
          .once("value")
          .then(snapshot => {
            snapshot.forEach(child => {
              services.push(child.val());
            });
            commit("toggleLoading", false);
          });

        commit("setServices", services);
      }
    },
    async fetchBoats({ commit, state }) {
      let boats = [];

      if (!state.boats.length) {
        db.ref("boats")
          .orderByChild("name")
          .once("value")
          .then(snapshot => {
            snapshot.forEach(child => {
              boats.push(child.val());
            });
            commit("toggleLoading", false);
          });

        commit("setBoats", boats);
      }
    }
  },
  modules: {}
});
