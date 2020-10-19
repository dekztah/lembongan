import Vue from "vue";
import Vuex from "vuex";
import VueMoment from "vue-moment";
import { auth, db } from "@/firebase/firebase";
import router from "../router/index";

Vue.use(Vuex);
Vue.use(VueMoment);

const currentTime = Vue.moment();

const columnWidth =
  window.innerWidth < 576 ? (window.innerWidth - 30) / 2 : 180;

export default new Vuex.Store({
  state: {
    timestamp: currentTime,
    today: currentTime.isoWeekday() - 1,
    weekArray: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    mobileNavOpen: false,
    loading: true,
    userProfile: {},
    places: [],
    activities: [],
    services: [],
    boats: [],
    document: {},
    columnWidth: columnWidth,
    warnDisabled: localStorage.getItem("boatWarnDisabled") || false
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
    },
    setDocument(state, val) {
      state.document = val;
    },
    setWarnDisabled(state, bool) {
      state.warnDisabled = bool;
    }
  },
  actions: {
    setWarnDisabled({ commit }) {
      localStorage.setItem("boatWarnDisabled", true);
      commit("setWarnDisabled", true);
    },
    toggleMobileNav({ commit }) {
      commit("toggleMobileNav");
    },
    closeMobileNav({ commit }) {
      commit("closeMobileNav");
    },
    updateTimeStamp({ commit }) {
      commit("updateTimeStamp");
    },
    async login({ dispatch }, form) {
      const { user } = await auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      dispatch("fetchUserProfile", user);
    },

    async logout({ commit }) {
      await auth.signOut();

      commit("setUserProfile", {});
      router.push("/login");
    },
    async fetchUserProfile({ commit }, user) {
      const userProfile = await db.ref(`users/${user.uid}`).once("value");

      commit("setUserProfile", userProfile.val());

      if (router.currentRoute.path === "/login") {
        router.push("/");
      }
    },
    async fetchCollection({ commit, state }, collectionName) {
      let collection = [];

      if (!state[collectionName].length) {
        commit("toggleLoading", true);
        await db
          .ref(collectionName)
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
    },
    async fetchDocument({ commit }, { collectionName, id }) {
      let document = {};

      await db
        .ref(`${collectionName}/${id}`)
        .once("value")
        .then(snapshot => {
          document = snapshot.val();
          document.key = snapshot.key;
          commit("setDocument", document);
          commit("toggleLoading", false);
        });
    },
    async update({ commit }, updates) {
      commit("toggleLoading", true);
      await db
        .ref()
        .update(updates)
        .then(() => {
          commit("toggleLoading", false);
        });
    }
  },
  modules: {}
});
