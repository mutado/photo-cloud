<template>
  <div>
    <div class="wrapper"><img :src="photo?.image" /></div>
    <router-link to="/photos">Go to photos</router-link>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Photo from "@/models/Photo";

export default defineComponent({
  computed: {
    photo() {
      return Photo.find(this.$route.params.id);
    },
  },
  mounted() {
    Photo.show(this.$route.params.id);
  },
});
</script>

<style>
.wrapper {
  text-align: center;
  
}
</style>
