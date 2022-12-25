<template>
  <div
    class="grid"
    :style="{
      gridTemplateColumns: `repeat(${12 - zoom},1fr)`
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
}
@media screen and (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
  }
}
</style>
