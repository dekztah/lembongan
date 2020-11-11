<template lang="pug">
  .dashboard.admin-form
    .lists
      .links
        router-link.button(to="/admin/places-list") Places
        router-link.button(to="/admin/boats-list") Boats
        router-link.button(to="/admin/activities-list") Activities
        router-link.button(to="/admin/services-list") Services

    .add
      .links
        router-link.button(to="/admin/plac") + new place
        router-link.button(to="/admin/boat") + new boat
        router-link.button(to="/admin/activity") + new activity
        router-link.button(to="/admin/service") + new service

</template>
