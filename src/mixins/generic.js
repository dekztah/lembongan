export default {
  computed: {
    search: {
      get() {
        return this.q ? this.q : "";
      },
      set(val) {
        if (val === "") val = undefined;
        this.$router.replace({
          query: { q: val, tags: this.tags, open: this.open || undefined }
        });
      }
    }
  },
  methods: {
    waUrl(contact) {
      return `https://wa.me/${contact}`;
    },
    chipVisible(place, key) {
      return place[key] && key !== "openNow";
    },
    toggleDouble(index) {
      this.isDouble = this.isDouble === index ? null : index;
      this.$nextTick(() => {
        this.$refs.isotope.arrange();
      });
      if (this.mobileNavOpen) this.toggleMobileNav();
    },
    setQuery(key, val) {
      this.setFilter({ key, val });

      if (key === "openNow") {
        if (!val) val = undefined;
        this.$router.replace({
          query: { q: this.q, tags: this.tags, open: val }
        });
      } else {
        let queryPush = JSON.parse(JSON.stringify(this.$route.query));
        if (!queryPush.tags) queryPush.tags = [];

        if (val) {
          queryPush.tags.push(key);
        } else {
          queryPush.tags.splice(this.tags.indexOf(key), 1);
        }
        this.$router.push({ query: queryPush });
      }
    }
  }
};
