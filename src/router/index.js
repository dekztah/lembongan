import Vue from "vue";
import VueRouter from "vue-router";
import qs from "qs";

import Boats from "../views/Boats.vue";
import TileList from "../views/TileList.vue";
import AccomodationList from "../views/AccomodationList.vue";
import Accomodation from "../views/Accomodation.vue";

import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";

import List from "../views/admin/List.vue";
import Item from "../views/admin/Item.vue";
import AccomodationItem from "../views/admin/AccomodationItem.vue";

import Boat from "../views/admin/Boat.vue";
import Dashboard from "../views/admin/Dashboard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/food-and-drink",
    name: "Dining",
    component: TileList,
    meta: {
      collection: "places",
      filterProps: [
        // TODO: get these from schema?
        "dineIn",
        "delivery",
        "noPreorder",
        "localDishes",
        "coffee",
        "rendang",
        "desserts",
        "drinks",
        "pizza",
        "sushi",
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
    path: "/accomodations",
    name: "Accomodations",
    component: AccomodationList,
    meta: {
      collection: "accomodations",
      filterProps: ["pool", "kitchen", "hotWater", "AC"]
    },
    props: route => ({
      tags: route.query.tags,
      q: route.query.q,
      open: route.query.open
    })
  },
  {
    path: "/accomodations/:id?",
    name: "Accomodation",
    component: Accomodation,
    meta: {
      collection: "accomodations"
    }
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
        "spa",
        "barber",
        "hairdresser",
        "laundry",
        "handcraft",
        "motorRepair",
        "scooterRental",
        "gaming",
        "printing",
        "babysitting",
        "taxi",
        "workspace"
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
    name: "Boat schedule",
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
        path: "/",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "places-list",
        name: "PlacesList",
        component: List,
        meta: {
          collection: "places",
          item: "Place",
          requiresAdmin: true
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
          item: "Boat",
          requiresAdmin: true
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
          item: "Activity",
          requiresAdmin: true
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
          item: "Service",
          requiresAdmin: true
        }
      },
      {
        path: "service/:id?",
        name: "Service",
        component: Item,
        meta: {
          collection: "services"
        }
      },
      {
        path: "accomodations-list",
        name: "AccomodationsList",
        component: List,
        meta: {
          collection: "accomodations",
          item: "Accomodation",
          requiresAdmin: true
        }
      },
      {
        path: "accomodation/:id?",
        name: "AccomodationAdmin",
        component: AccomodationItem,
        meta: {
          collection: "accomodations"
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
