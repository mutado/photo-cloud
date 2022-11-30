<template>
  <img src="" alt="" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoThumbnail',
  props: {
    photo_id: {
      type: Number,
      required: true
    }
  },
  computed: {
    image() {
      return this.photo.image
    }
  }
})
</script>
