<template>
  <teleport to="#toolbar">
    <zoom-control />
    <div class="headerChild">
      <v-button :to="'/about'">
        <i class="bi bi-light bi-cloud-upload"></i>
      </v-button>
      <v-button :disabled="!selected.length">
        <i class="bi bi-light bi-folder-plus"></i>
      </v-button>
      <v-button :disabled="!selected.length">
        <i class="bi bi-light bi-heart"></i>
      </v-button>
      <v-button :disabled="!selected.length">
        <i class="bi bi-light bi-box-arrow-up"></i>
      </v-button>
      <v-button :disabled="!selected.length">
        <i class="bi bi-light bi-trash3"></i>
      </v-button>
    </div>
  </teleport>
  <items-grid v-if="loaded && photos?.length !== 0">
    <photo-thumbnail
      v-selectable:[photo.id]="{
        getItems: getPhotoIds,
        setSelection: setSelection,
        getSelection: getSelection
      }"
      :class="{ selected: selected.includes(photo.id) }"
      v-for="photo in photos"
      :key="photo.id"
      :photo_id="photo.id"
    />
  </items-grid>
  <div v-else-if="photos?.length == 0">
    <p class="text-center">No photos in this folder</p>
  </div>
</template>
<script lang="ts">
import Folder from '@/models/Folder'
import ItemsGrid from '@/components/ItemsGrid.vue'
import PhotoThumbnail from '@/components/PhotoThumbnail.vue'
import VButton from '@/components/VButton.vue'
import ZoomControl from '@/components/ZoomControl.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotosView',
  components: {
    ItemsGrid,
    PhotoThumbnail,
    VButton,
    ZoomControl
  },
  data() {
    return {
      loaded: false,
      selected: [] as string[]
    }
  },
  methods: {
    setSelection(selected: string[]) {
      this.selected = selected
    },
    getSelection() {
      return this.selected
    },
    getPhotoIds() {
      return this.photos?.map((photo: any) => photo.id)
    }
  },
  mounted() {
    Folder.show(this.$route.params.id as string).then(() => {
      this.loaded = true
    })
  },
  computed: {
    folderId() {
      return this.$route.params.id
    },
    photos() {
      return Folder.query()
        .with('photo_references.photo')
        .find(this.$route.params.id)
        ?.photo_references.map((ref: any) => ref.photo)
    }
  },
  watch: {
    folderId() {
      console.log('folderId changed')
      if (this.$route.name !== 'album-photos') return
    },
    '$route.params.id': {
      handler: function (id) {
        console.log('folder id' + id)
        this.loaded = false
        if (this.$route.name !== 'album-photos') return
        Folder.show(this.$route.params.id as string).then(() => {
          this.loaded = true
        })
      },
      deep: true,
      immediate: true
    }
  }
})
</script>
