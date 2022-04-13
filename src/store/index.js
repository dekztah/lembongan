import Vue from "vue";
import Vuex from "vuex";
import { auth, db } from "@/firebase/firebase";
import { ref, child, get, update } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
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
            boats: [],
            accomodations: [],
        },
        isMobile: window.innerWidth < 992,
        document: {},
        warnDisabled: localStorage.getItem("boatWarnDisabled") || false,
        lastUpdate: null,
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
        },
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
            const { user } = await signInWithEmailAndPassword(
                auth,
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
            const dbRef = ref(db);

            await get(child(dbRef, `users/${user.uid}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        commit("setUserProfile", snapshot.val());
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

            if (router.currentRoute.path === "/login") {
                router.push("/");
            }
        },

        async fetchCollection({ commit, state, dispatch }, collectionName) {
            let collection = [];

            dispatch("fetchLastUpdate");

            if (!state.collections[collectionName].length) {
                commit("toggleLoading", true);

                const dbRef = ref(db);

                await get(child(dbRef, collectionName))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            snapshot.forEach((child) => {
                                let item = child.val();
                                item.key = child.key;
                                collection.push(item);
                            });
                            commit("toggleLoading", false);
                        } else {
                            console.log("No data available");
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                commit("setCollection", { collectionName, collection });
            }
        },

        async fetchDocument({ commit }, { collectionName, id }) {
            let document = {};

            const dbRef = ref(db);

            await get(child(dbRef, `${collectionName}/${id}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        document = snapshot.val();
                        document.key = snapshot.key;
                        commit("setDocument", document);
                        commit("toggleLoading", false);
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        async fetchLastUpdate({ commit }) {
            const dbRef = ref(db);

            await get(child(dbRef, `lastUpdate`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        commit("setLastUpdate", snapshot.val());
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        async update({ commit }, updates) {
            updates.lastUpdate = utcToZonedTime(new Date(), "Asia/Makassar");

            await update(ref(db), updates)
                .then(() => {
                    commit("toggleLoading", false);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },

    getters: {
        boats: (state) => state.collections.boats,
        timestamp: (state) => state.timestamp,
        isMobile: (state) => state.isMobile,
        userProfile: (state) => state.userProfile,
        isAdmin: (state) => state.userProfile.role === "admin",
        lastUpdate: (state) => state.lastUpdate,
    },

    modules: {},
});
