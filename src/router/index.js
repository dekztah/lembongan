import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/food-and-drink",
    name: "FoodAndDrink",
    component: () =>
      import(
        /* webpackChunkName: "food-and-drink" */ "../views/FoodAndDrink.vue"
      )
  },
  {
    path: "/activities",
    name: "Activities",
    component: () =>
      import(/* webpackChunkName: "activities" */ "../views/Activities.vue")
  },
  {
    path: "/boats",
    name: "Boats",
    component: () =>
      import(/* webpackChunkName: "boats" */ "../views/Boats.vue")
  },
  // {
  //   path: '/contact',
  //   name: 'Contact',
  //   component: () =>
  //     import(/* webpackChunkName: "contact" */ '../views/Contact.vue'),
  // },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/addPlace",
    name: "AddPlace",
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "add" */ "../views/AddPlace.vue")
  },
  {
    path: "/",
    redirect: "/food-and-drink"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
