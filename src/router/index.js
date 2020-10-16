import Vue from "vue";
import VueRouter from "vue-router";
import qs from "qs";

import FoodAndDrink from "../views/FoodAndDrink.vue";
import Activities from "../views/Activities.vue";
import Services from "../views/Services.vue";
import Boats from "../views/Boats.vue";

import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";

import PlacesList from "../views/admin/PlacesList.vue";
import Place from "../views/admin/Place.vue";
import BoatsList from "../views/admin/BoatsList.vue";
import Boat from "../views/admin/Boat.vue";
import ActivitiesList from "../views/admin/ActivitiesList.vue";
import Activity from "../views/admin/Activity.vue";
import ServicesList from "../views/admin/ServicesList.vue";
import Service from "../views/admin/Service.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/food-and-drink",
    name: "Food & Drink",
    component: FoodAndDrink,
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
  },
  {
    path: "/activities",
    name: "Activities",
    component: Activities,
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
  },
  {
    path: "/services",
    name: "Services",
    component: Services,
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
  },
  {
    path: "/boats",
    name: "Boats",
    component: Boats
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/admin",
    meta: {
      requiresAuth: true
    },
    component: Admin,
    children: [
      {
        path: "places-list",
        name: "PlacesList",
        component: PlacesList
      },
      {
        path: "place/:id?",
        name: "Place",
        component: Place
      },
      {
        path: "boats-list",
        name: "BoatsList",
        component: BoatsList
      },
      {
        path: "boat/:id?",
        name: "Boat",
        component: Boat
      },
      {
        path: "activities-list",
        name: "ActivitiesList",
        component: ActivitiesList
      },
      {
        path: "activity/:id?",
        name: "Activity",
        component: Activity
      },
      {
        path: "services-list",
        name: "ServicesList",
        component: ServicesList
      },
      {
        path: "service/:id?",
        name: "Service",
        component: Service
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
