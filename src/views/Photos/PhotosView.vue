<template>
  <input type="range" v-model="zoom" min="3" max="9" />
  {{ 12 - zoom }}
  <div
    class="grid"
    :style="{
      gridTemplateColumns: `repeat(${12 - zoom},1fr)`
    }"
  >
    <photo-thumbnail
      v-for="photo in photos"
      :key="photo.id"
      :photo_id="photo.id"
    />
  </div>
</template>
<script lang="ts">
import PhotoThumbnail from '@/components/PhotoThumbnail.vue'
import Photo from '@/models/Photo'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { PhotoThumbnail },
  data() {
    return {
      zoom: 3,
      imgs: [],
      imageAdded: false,
      inputMessageText: ''
    }
  },
  mounted() {
    Photo.index()
  },
  computed: {
    photos: () => Photo.all()
  }
})
</script>
<style scoped>
.grid {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
</style>
