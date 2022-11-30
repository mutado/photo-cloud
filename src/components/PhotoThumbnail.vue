<template>
  <img :src="photo?.image" />
</template>
<script lang="ts">
import Photo from '@/models/Photo'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoThumbnail',
  props: {
    photo_id: {
      type: String,
      required: true
    }
  },
  computed: {
    photo() {
      return Photo.find(this.photo_id)
    }
  }
})
</script>
<style scoped>
img {
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 30px;
  border: 5px solid #dddddd;
  width: 100%;
}
</style>
