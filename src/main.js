import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { rtdbPlugin as VueFire } from 'vuefire';
import '@/assets/styles/main.scss';

Vue.use(VueFire);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
