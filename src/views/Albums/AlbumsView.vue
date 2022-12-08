<template>
  <div
    class="grid"
    :style="{
      gridTemplateColumns: `repeat(${12 - zoom},1fr)`
    }"
  >
    <album-thumbnail v-for="folder in folders" :folder_id="folder.id" />
  </div>
</template>
<script lang="ts">
import Folder from '@/models/Folder'
import AlbumThumbnail from '@/components/AlbumThumbnail.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AlbumsView',
  components: {
    AlbumThumbnail
  },
  mounted() {
    Folder.index()
  },
  computed: {
    folders() {
      return Folder.all()
    },
    zoom() {
      return this.$store.state.entities.photos.zoom
    }
  }
})
</script>
<style scoped>
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
