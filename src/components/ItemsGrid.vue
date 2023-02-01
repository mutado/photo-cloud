<template>
  <div
    class="grid"
    :style="{
      gridTemplateColumns: `repeat(${12 - zoom},1fr)`
    }"
    :class="{
      center: aspectRatio
    }"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ItemsGrid',
  computed: {
    zoom() {
      return Math.trunc(this.$store.state.entities.photos.zoom)
    },
    aspectRatio() {
      return this.$store.state.entities.photos.center_image
    }
  }
})
</script>
<style>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 1rem;
  padding: 1rem;
  transition: gap 0.5s;
  grid-auto-flow: row;
}
.grid > * {
}
.center {
  gap: 0.3rem !important;
}
@media screen and (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
  }
}
</style>
