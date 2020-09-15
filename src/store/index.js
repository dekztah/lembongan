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
    setCollection(state, { collectionName, collection }) {
      state[collectionName] = collection;
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
    async fetchCollection({ commit, state }, collectionName) {
      let collection = [];

      if (!state[collectionName].length) {
        db.ref(collectionName)
          .orderByChild("name")
          .once("value")
          .then(snapshot => {
            snapshot.forEach(child => {
              let item = child.val();
              item.key = child.key;
              collection.push(item);
            });
            commit("toggleLoading", false);
          });

        commit("setCollection", { collectionName, collection });
      }
    }
  },
  modules: {}
});
