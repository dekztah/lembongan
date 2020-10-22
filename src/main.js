import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { auth } from "@/firebase/firebase";

import "@/assets/styles/main.scss";

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    next("/login");
  } else {
    next();
  }
});

let ralewayFontFace = new FontFace(
  "Raleway",
  "url(https://fonts.gstatic.com/s/raleway/v18/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCIPrE.woff2)",
  { style: "normal", weight: 400 }
);

ralewayFontFace
  .load()
  .then(font => {
    document.fonts.add(font);
    document.body.style.fontFamily = '"Raleway", sans-serif';
  })
  .catch(error => {
    console.log("e", error);
  });

let app;
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }

  if (user) {
    store.dispatch("fetchUserProfile", user);
  }
});
