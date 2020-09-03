import Vue from 'vue';
import Vuex from 'vuex';
import VueMoment from 'vue-moment';

Vue.use(Vuex);
Vue.use(VueMoment);

const currentTime = Vue.moment();

export default new Vuex.Store({
  state: {
    timestamp: currentTime,
    day: currentTime.day() - 1,
    hour: currentTime.hour(),
    minute: currentTime.minute(),
  },
  mutations: {},
  actions: {},
  modules: {},
});
