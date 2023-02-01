<template>
  <div>
    ISO: {{ photo.tags.iso }}
    <br />
    Aperture: {{ photo.tags.aperture }}
    <br />
    Focal Length: {{ photo.tags.focal_length }}
    <br />
    Lens: {{ photo.tags.lens }}
    <br />
    Camera: {{ photo.tags.make }} {{ photo.tags.model }}
    <br />
    Date: {{ photo.tags.created_at }}
    <br />
    Location: {{ photo.tags.location.address }}
    <br />
  </div>
</template>
<script setup lang="ts">
import Photo from '@/models/Photo'
import { computed } from 'vue'

const props = defineProps<{
  photoId: string
}>()

const photo = computed(() => {
  return Photo.find(props.photoId)!
})
</script>
<style scoped>
div {
  padding: 5px;
}
</style>
