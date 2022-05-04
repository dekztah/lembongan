<template lang="pug">
#app
    transition(name="fade")
        .loading(v-show="loading")
            .loader.blasting-ripple

    transition(name="fade")
        .wrapper(
            v-show="!loading",
            :class="{ 'mobile-nav-open': mobileNavOpen }",
            v-if="!maintenance"
        )
            header
                #nav-mobile
                    .hamburger.hamburger--emphatic(
                        type="button",
                        @click="toggleMobileNav",
                        :class="{ 'is-active': mobileNavOpen }"
                    )
                        .hamburger-box
                            .hamburger-inner

                #nav(:class="{ active: mobileNavOpen }")
                    router-link(to="/food-and-drink") Dining
                    router-link(to="/boats") Boat schedule
                    router-link(to="/activities") Activities
                    router-link(to="/services") Services
                    router-link(to="/shops") Shops
                    //- router-link(to="/accomodations") Accomodations

                .greeting
                    //- h1 Selamat {{ partOfTheDay }}!
                    h1 Lembongan
                    .current-page {{ $route.name }}

                .today
                    h2 {{ dayOfTheWeek }}
                    | {{ date }}
                    br
                    | {{ time }}

            router-view

            footer
                .public-footer
                    .left
                        div(v-if="lastUpdate")
                            .last last updated:
                            div {{ lastUpdateFormatted }}

                    .right
                        .contact-me Incorrect data? #[br] Contact me on:&nbsp;
                        a.social.tg(
                            href="https://t.me/dekztah",
                            target="_blank",
                            rel="noopener"
                        )

                    //- a.kofi(href="https://ko-fi.com/dekztah" target="_blank" rel="noopener")

                .admin-footer(v-if="userProfile.name")
                    span.username {{ userProfile.name }}
                    template(v-if="isAdmin")
                        router-link.button(to="/admin/places-list") Places
                        router-link.button(to="/admin/boats-list") Boats
                        router-link.button(to="/admin/activities-list") Activities
                        router-link.button(to="/admin/services-list") Services
                        router-link.button(to="/admin/shops-list") Shops
                        router-link.button(to="/admin/accomodations-list") Accomodations

                    a.button(@click="logout") logout

        .wrapper(v-else)
            .maintenance Maintenance, we will be back soon
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { format, isWithinInterval, parse } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export default {
    data() {
        return {
            maintenance: false,
        };
    },
    computed: {
        ...mapState(["userProfile", "loading", "mobileNavOpen", "timestamp"]),
        ...mapGetters(["isAdmin", "lastUpdate"]),
        showLogout() {
            return Object.keys(this.userProfile).length > 1;
        },
        dayOfTheWeek() {
            return format(this.timestamp, "EEE");
        },
        date() {
            return format(this.timestamp, "yyyy-MM-dd");
        },
        time() {
            return format(this.timestamp, "HH:mm");
        },
        lastUpdateFormatted() {
            return format(
                utcToZonedTime(this.lastUpdate, "Asia/Makassar"),
                "yyyy-MM-dd HH:mm"
            );
        },
        partOfTheDay() {
            let parts = ["pagi", "siang", "sore", "malam"];

            if (
                isWithinInterval(this.timestamp, {
                    start: this.parseTime("4:00"),
                    end: this.parseTime("10:00"),
                })
            ) {
                return parts[0];
            }

            if (
                isWithinInterval(this.timestamp, {
                    start: this.parseTime("10:00"),
                    end: this.parseTime("14:00"),
                })
            ) {
                return parts[1];
            }

            if (
                isWithinInterval(this.timestamp, {
                    start: this.parseTime("14:00"),
                    end: this.parseTime("18:30"),
                })
            ) {
                return parts[2];
            }

            return parts[3];
        },
    },
    mounted() {
        setInterval(() => {
            this.updateTimeStamp();
        }, 30000);
    },
    methods: {
        ...mapActions([
            "toggleMobileNav",
            "logout",
            "closeMobileNav",
            "updateTimeStamp",
        ]),
        parseTime(time) {
            return parse(
                time,
                "HH:mm",
                utcToZonedTime(new Date(), "Asia/Makassar")
            );
        },
    },
    watch: {
        $route(to, from) {
            if (from.name && from.name !== to.name) {
                this.closeMobileNav();
            }
        },
    },
};
</script>
