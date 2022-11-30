<template>
  <div>
    <img height="150" v-for="(photo, index) in photos" :src="photo.image" />
  </div>
</template>
<script lang="ts">
import Photo from '@/models/Photo'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
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
  },
  methods: {
    isImage(url: any) {
      return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
    }
  }
})
</script>
