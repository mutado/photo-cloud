<template>
  <teleport to="#toolbar">
    <zoom-control />
    <div class="headerChild">
      <v-button @click="create">
        <i class="bi bi-light bi-folder-plus"></i>
      </v-button>
      <v-button :disabled="selected.length == 0">
        <i class="bi bi-light bi-trash3"></i>
      </v-button>
    </div>
  </teleport>
  <items-grid>
    <album-thumbnail
      v-for="folder in folders"
      :id="folder.id"
      :folder_id="folder.id"
      ref="items"
      v-selectable:[folder.id]="{
        getItems: getFolderIds,
        setSelection: setSelection,
        getSelection: getSelection
      }"
      :class="{ selected: selected.includes(folder.id) }"
    />
  </items-grid>
</template>
<script lang="ts">
import Folder from '@/models/Folder'
import AlbumThumbnail from '@/components/AlbumThumbnail.vue'
import ZoomControl from '@/components/ZoomControl.vue'
import VButton from '@/components/VButton.vue'
import VSelectable from '@/components/VSelectable.vue'
import ItemsGrid from '@/components/ItemsGrid.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AlbumsView',
  components: {
    AlbumThumbnail,
    ZoomControl,
    VButton,
    VSelectable,
    ItemsGrid
  },
  mounted() {
    Folder.index()
  },
  data() {
    return {
      selected: [] as string[]
    }
  },
  computed: {
    folders() {
      return Folder.all()
    },
    zoom() {
      return Math.trunc(this.$store.state.entities.photos.zoom)
    }
  },
  methods: {
    getFolderIds() {
      return this.folders.map((folder) => folder.id)
    },
    setSelection(ids: string[]) {
      this.selected = ids
    },
    getSelection() {
      return this.selected
    },
    create() {
      Folder.insert({ data: { name: 'New Folder' } })
      this.$nextTick(() => {
        this.$refs.items[this.$refs.items.length - 1].rename()
      })
    }
  }
})
</script>
