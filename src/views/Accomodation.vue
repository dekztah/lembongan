<template lang="pug">
.main.accomodation-details
    h1.name {{ document.name }}
    .type {{ document.type }} with {{ document.view }}

    .description „{{ document.description }}”

    hr
    h3 Features

    .info
      chip(
        v-for="(cb, key) in document.properties"
        :key="`chip-${key}`"
        :name="key"
      )

    hr
    h3 Location

    .location
      a.social.maps(v-if="document.gMapsLink" :href="document.gMapsLink" target="_blank" rel="noopener")
      strong {{ document.location }}

    br

    | Distance to beach: #[strong {{ document.beachDistance }}m ]

    hr
    h3 Photos

    .images(v-if="document.images")
      img(v-if="document.images.main" :src="document.images.main")
      img(v-if="document.images.bedroom" :src="document.images.bedroom")
      img(v-if="document.images.bathroom" :src="document.images.bathroom")
      img(v-if="document.images.view" :src="document.images.view")
      img(v-if="document.images.other" :src="document.images.other")

    hr
    h3 Rates

    .grid-3
      .price Daily #[br] #[strong {{ document.rates.daily | currencyIDR }}]
      .price Weekly #[br] #[strong {{ document.rates.weekly | currencyIDR }}]
      .price Monthly #[br] #[strong {{ document.rates.monthly | currencyIDR }}]

    .other
      strong(v-if="document.rates.electricityIncluded || document.rates.waterIncluded || document.rates.cleaningIncluded") price includes:
      div(v-if="document.rates.electricityIncluded") - Electricity
      div(v-if="document.rates.waterIncluded") - Drinking Water
      div(v-if="document.rates.cleaningIncluded") - Cleaning service

    .other
      strong(v-if="!document.rates.electricityIncluded || !document.rates.waterIncluded || !document.rates.cleaningIncluded") price does not include:
      div(v-if="!document.rates.electricityIncluded") - Electricity
      div(v-if="!document.rates.waterIncluded") - Drinking Water
      div(v-if="!document.rates.cleaningIncluded") - Cleaning service

    hr
    h3 Contact

    .contact
      a.social.email(href="mailto:pemuntalan@gmail.com" target="_blank" rel="noopener")
      span E-mail

    .contact
      a.social.wa(href="https://wa.me/6281237940300" target="_blank" rel="noopener")
      span WA



</template>

<script>
import store from "@/store";
import chip from "@/components/Chip";
import { mapState, mapGetters } from "vuex";

const formatter = new Intl.NumberFormat("ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0
});

export default {
  computed: {
    ...mapState(["document"])
  },

  components: {
    chip
  },

  filters: {
    currencyIDR(value) {
      if (!value) return "TBD";
      return formatter.format(value);
    }
  },

  beforeRouteEnter(to, from, next) {
    store
      .dispatch("fetchDocument", {
        collectionName: to.meta.collection,
        id: to.params.id
      })
      .then(() => {
        next();
      });
  }
};
</script>
<style lang="scss">
.accomodation-details {
  padding: 8px 16px;
  background: white;

  h1.name {
    margin-bottom: 0;
  }

  hr {
    opacity: 0.3;
    margin-top: 24px;
    margin-bottom: 0;
  }

  .description {
    font-size: 16px;
    font-style: italic;
    font-weight: bold;
    margin-top: 16px;
  }

  .images {
    img {
      width: 100%;
    }
  }

  .location {
    a {
      margin-right: 8px;
    }
    display: flex;
    align-items: center;
  }

  .other {
    margin-top: 16px;
  }

  .contact {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    a {
      margin-right: 8px;
    }
  }
  .grid-3 {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr 1fr 1fr;
    text-align: center;

    .price {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      padding: 4px;
    }
  }
}
</style>
