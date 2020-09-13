import Vue from "vue";
import VueRouter from "vue-router";
import qs from "qs";

Vue.use(VueRouter);

const routes = [
  {
    path: "/food-and-drink",
    name: "FoodAndDrink",
    component: () =>
      import(
        /* webpackChunkName: "food-and-drink" */ "../views/FoodAndDrink.vue"
      ),
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
  },
  {
    path: "/activities",
    name: "Activities",
    component: () =>
      import(/* webpackChunkName: "activities" */ "../views/Activities.vue"),
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
  },
  {
    path: "/services",
    name: "Services",
    component: () =>
      import(/* webpackChunkName: "services" */ "../views/Services.vue"),
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
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
      },
      {
        path: "activities-list",
        name: "ActivitiesList",
        component: () =>
          import(
            /* webpackChunkName: "activities-list" */ "../views/admin/ActivitiesList.vue"
          )
      },
      {
        path: "activity/:id?",
        name: "Activity",
        component: () =>
          import(
            /* webpackChunkName: "activity" */ "../views/admin/Activity.vue"
          )
      },
      {
        path: "services-list",
        name: "ServicesList",
        component: () =>
          import(
            /* webpackChunkName: "services-list" */ "../views/admin/ServicesList.vue"
          )
      },
      {
        path: "service/:id?",
        name: "Service",
        component: () =>
          import(/* webpackChunkName: "service" */ "../views/admin/Service.vue")
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
  parseQuery: query => {
    return qs.parse(query);
  },
  stringifyQuery: query => {
    let result = qs.stringify(query, { encode: false });
    return result ? "?" + result : "";
  },
  routes
});

export default router;
