import Vue from "vue";
import Vuex from "vuex";
import { auth, db } from "@/firebase/firebase";
import router from "../router/index";
import { getISODay } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

Vue.use(Vuex);

const currentTime = utcToZonedTime(new Date(), "Asia/Makassar");

export default new Vuex.Store({
  state: {
    timestamp: currentTime,
    today: getISODay(currentTime) - 1,
    weekArray: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    mobileNavOpen: false,
    loading: true,
    userProfile: {},
    filters: null,
    collections: {
      places: [],
      activities: [],
      services: [],
      boats: []
    },
    isMobile: window.innerWidth < 992,
    document: {},
    warnDisabled: localStorage.getItem("boatWarnDisabled") || false,
    lastUpdate: null
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },

    updateTimeStamp(state) {
      state.timestamp = utcToZonedTime(new Date(), "Asia/Makassar");
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
      state.collections[collectionName] = collection;
    },

    setDocument(state, val) {
      state.document = val;
    },

    setWarnDisabled(state, bool) {
      state.warnDisabled = bool;
    },

    setFilters(state, filters) {
      state.filters = filters;
    },

    setFilter(state, { key, val }) {
      state.filters[key] = val;
    },

    setLastUpdate(state, val) {
      state.lastUpdate = val;
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

    setFilters({ commit }, filters) {
      commit("setFilters", filters);
    },

    setFilter({ commit }, obj) {
      commit("setFilter", obj);
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

    async fetchCollection({ commit, state, dispatch }, collectionName) {
      let collection = [];

      dispatch("fetchLastUpdate");

      if (!state.collections[collectionName].length) {
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

    async fetchLastUpdate({ commit }) {
      await db
        .ref("lastUpdate")
        .once("value")
        .then(snapshot => {
          commit("setLastUpdate", snapshot.val());
        });
    },

    async update({ commit }, updates) {
      const updated = Date.now();
      commit("toggleLoading", true);
      await db
        .ref()
        .update(updates)
        .then(() => {
          db.ref().update({ lastUpdate: updated });
          commit("toggleLoading", false);
        });
    }
  },

  getters: {
    boats: state => state.collections.boats,
    timestamp: state => state.timestamp,
    isMobile: state => state.isMobile,
    userProfile: state => state.userProfile,
    isAdmin: state => state.userProfile.role === "admin",
    lastUpdate: state => state.lastUpdate
  },

  modules: {}
});
