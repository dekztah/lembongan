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
    path: "/admin",
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/Admin.vue"),

    children: [
      {
        path: "",
        name: "PlacesList",
        component: () =>
          import(
            /* webpackChunkName: "places-list" */ "../views/admin/PlacesList.vue"
          )
      },
      {
        path: "place/:id?",
        name: "Place",
        component: () =>
          import(/* webpackChunkName: "place" */ "../views/admin/Place.vue")
      },
      {
        path: "boats-list",
        name: "BoatsList",
        component: () =>
          import(
            /* webpackChunkName: "boats-list" */ "../views/admin/BoatsList.vue"
          )
      },
      {
        path: "boat/:id?",
        name: "Boat",
        component: () =>
          import(/* webpackChunkName: "boat" */ "../views/admin/Boat.vue")
      }
    ]
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
