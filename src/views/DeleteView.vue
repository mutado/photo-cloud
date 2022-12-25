<template>
  <div>
    <button @click="deletePhotos">Delete Photos</button>
    <router-link to="/photos">Go to photos</router-link>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    deletePhotos() {
      if (confirm("Are you sure you want to delet selected photos?")) {
        this.$store.state.entities.photos.selected.forEach((photo) => {
          axios.delete("http://167.172.172.251/api/photos/" + photo);
        });
      }
    },
  },
});
</script>
