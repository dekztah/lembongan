<template lang="pug">
  .admin-form
    .top
      .grid-item
        .form-element
          label Name
          input(type="text" v-model="form.name")

        .form-element
          label Description
          input(type="text" v-model="form.description")

        .form-element
          label Type
          input(type="text" v-model="form.type")

        .form-element
          label View
          input(type="text" v-model="form.view")

        .form-element
          label Active
          input(type="checkbox" v-model="form.active")

      .grid-item
        .form-element
          label Location
          input(type="text" v-model="form.location")

        .form-element
          label Distance to beach
          input(type="text" v-model="form.beachDistance")

        .form-element
          label Maps link
          input(type="text" v-model="form.gMapsLink")

      .grid-item(v-if="form.rates")
        .form-element
          label Daily rate
          input(type="text" v-model="form.rates.daily")

        .form-element
          label Weekly rate
          input(type="text" v-model="form.rates.weekly")

        .form-element
          label Monthly rate
          input(type="text" v-model="form.rates.monthly")

      .grid-item(v-if="form.rates")
        .form-element
          label What's included
          .checkboxes
            .checkbox
              input(type="checkbox" v-model="form.rates.electricityIncluded")
              label electricity included

            .checkbox
              input(type="checkbox" v-model="form.rates.waterIncluded")
              label water included

            .checkbox
              input(type="checkbox" v-model="form.rates.cleaningIncluded")
              label cleaning included

      .grid-item.images(v-if="form.images")
        .form-element(v-for="(image, key ) in form.images")
          label {{ key }} image
          input(v-if="form.images[key] === ''" type="file" @change="onFileChange(key, $event)")

          .image(v-else)
            img( :src="form.images[key]")
            .clear(@click="form.images[key] = ''")

    .middle
      label Properties
      .checkboxes
        .checkbox(v-for="(cb,key) in form.properties" :key="key")
          input(type="checkbox" v-model="form.properties[key]" :id="key")
          label(:for="key") {{ text(key) }}

    .save
      button.button(@click= "insert" :disabled="saveDisabled") save

</template>

<script>
import { db, storage } from "@/firebase/firebase";
import { mapState, mapGetters } from "vuex";
import deepmerge from "deepmerge";
import { utcToZonedTime } from "date-fns-tz";

export default {
  data() {
    return {
      form: {},
      key: this.$route.params.id,
      saveDisabled: false,
      uploadComplete: false,
      uploadProgess: 0
    };
  },

  computed: {
    ...mapState(["document", "loading"]),
    ...mapGetters(["isAdmin"]),

    collectionName() {
      return this.$route.meta.collection;
    },

    schema() {
      const schema = require(`@/assets/${this.collectionName}-schema.json`);
      return JSON.parse(JSON.stringify(schema));
    }
  },

  mounted() {
    if (this.key !== undefined) {
      const overwriteMerge = (destinationArray, sourceArray, options) =>
        sourceArray;

      this.$store
        .dispatch("fetchDocument", {
          collectionName: this.collectionName,
          id: this.key
        })
        .then(() => {
          this.$set(
            this,
            "form",
            deepmerge(this.schema, this.document, {
              arrayMerge: overwriteMerge
            })
          );
        });
    } else {
      this.$set(this, "form", this.schema);
      this.$store.commit("toggleLoading", false);
    }
  },

  methods: {
    text(str) {
      return str.replace(/([A-Z])/g, g => ` ${g[0].toLowerCase()}`);
    },

    insert() {
      this.saveDisabled = true;

      if (!this.key) {
        this.key = db.ref(this.collectionName).push().key;
        this.form.createdDate = utcToZonedTime(new Date(), "Asia/Makassar");
      }

      let updates = {};
      updates[`/${this.collectionName}/` + this.key] = this.form;

      this.$store.dispatch("update", updates).then(() => {
        this.saveDisabled = false;
        if (!this.$route.params.id)
          this.$router.push({ params: { id: this.key } });
      });
    },

    onFileChange(key, e) {
      let files = e.target.files;

      if (files.length) {
        files.forEach(file => {
          let storageRef = storage.ref(`accomodations/${file.name}`);
          let task = storageRef.put(file);
          task.on(
            "state_changed",
            snapshot => {
              var percentage =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              this.uploadProgress = percentage;
            },
            err => {
              console.log("err", err);
            },
            () => {
              task.snapshot.ref.getDownloadURL().then(downloadURL => {
                this.form.images[key] = downloadURL;
                this.uploadComplete = true;
              });
            }
          );
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.image {
  width: 200px;
  overflow: hidden;
  border-radius: 4px;
  position: relative;

  img {
    display: block;
    width: 100%;
  }
  .clear {
    position: absolute;
    right: 8px;
    top: 8px;
    background-color: white;
    border-radius: 100%;
    padding: 12px;
  }
}

.grid-item.images {
  .form-element {
    height: auto;
  }
}
</style>
