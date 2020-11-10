import Vue from "vue";
import VueRouter from "vue-router";
import qs from "qs";

import Boats from "../views/Boats.vue";
import TileList from "../views/TileList.vue";

import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";

import List from "../views/admin/List.vue";
import Item from "../views/admin/Item.vue";
import Boat from "../views/admin/Boat.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/food-and-drink",
    name: "Food & Drink",
    component: TileList,
    meta: {
      collection: "places",
      filterProps: [
        "dineIn",
        "delivery",
        "noPreorder",
        "localDishes",
        "coffee",
        "rendang",
        "desserts",
        "drinks",
        "winesAndSpirits"
      ]
    },
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
  },
  {
    path: "/activities",
    name: "Activities",
    component: TileList,
    meta: {
      collection: "activities",
      filterProps: [
        "yoga",
        "gym",
        "freediving",
        "scubaDiving",
        "surf",
        "snorkeling",
        "tour"
      ]
    },
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
  },
  {
    path: "/services",
    name: "Services",
    component: TileList,
    meta: {
      collection: "services",
      filterProps: [
        "noPreorder",
        "spa",
        "barber",
        "hairdresser",
        "laundry",
        "handcraft",
        "motorRepair"
      ]
    },
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
        component: List,
        meta: {
          collection: "places",
          item: "Place"
        }
      },
      {
        path: "place/:id?",
        name: "Place",
        component: Item,
        meta: {
          collection: "places"
        }
      },
      {
        path: "boats-list",
        name: "BoatsList",
        component: List,
        meta: {
          collection: "boats",
          item: "Boat"
        }
      },
      {
        path: "boat/:id?",
        name: "Boat",
        component: Boat
      },
      {
        path: "activities-list",
        name: "ActivitiesList",
        component: List,
        meta: {
          collection: "activities",
          item: "Activity"
        }
      },
      {
        path: "activity/:id?",
        name: "Activity",
        component: Item,
        meta: {
          collection: "activities"
        }
      },
      {
        path: "services-list",
        name: "ServicesList",
        component: List,
        meta: {
          collection: "services",
          item: "Service"
        }
      },
      {
        path: "service/:id?",
        name: "Service",
        component: Item,
        meta: {
          collection: "services"
        }
      }
    ]
  },
  {
    path: "*",
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
