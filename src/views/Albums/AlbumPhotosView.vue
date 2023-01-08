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
      <VDropdown>
        <v-button :disabled="!selected.length">
          <i class="bi bi-light bi-trash3"></i>
        </v-button>
        <template #popper>
          <div class="popDeleteContainer">
            <div class="popDeleteMessage">
              Are you sure you want to delete these photos from album?
            </div>
            <div class="popDeleteButtons">
              <button
                @click="deletePhotos"
                v-close-popper
                class="popDeleteButton"
                id="popDeleteYes"
              >
                Yes
              </button>
              <button
                v-close-popper
                class="popDeleteButton"
                id="popDeleteCancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </template>
      </VDropdown>
    </div>
  </teleport>
  <items-grid v-if="loaded && photoReferences?.length !== 0">
    <photo-thumbnail
      v-selectable:[photoReference.id]="{
        getItems: getPhotoIds,
        setSelection: setSelection,
        getSelection: getSelection
      }"
      :class="{ selected: selected.includes(photoReference.id) }"
      v-for="photoReference in photoReferences"
      :key="photoReference.id"
      :photo_id="photoReference.photo_id"
    />
  </items-grid>
  <div v-else-if="photoReferences?.length == 0">
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
import { Item } from '@vuex-orm/core'
import FolderPhoto from '@/models/FolderPhoto'

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
      return this.photoReferences?.map((photo: any) => photo.id)
    },
    deletePhotos() {
      this.getSelection().forEach((reference_id: string) => {
        Folder.destroyPhoto(this.folderId, reference_id)
      });
      location.reload();
    }
  },
  mounted() {
    Folder.show(this.$route.params.id as string).then(() => {
      this.loaded = true
    })
  },
  computed: {
    folderId():string {
      return this.$route.params.id as string
    },
    photoReferences():FolderPhoto[]|undefined {
      return this.folder?.photo_references
    },
    folder():Item<Folder> {
      return Folder.query().with('photo_references').find(this.folderId)
    },
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

<style>
.headerChild {
  display: flex;
  flex-direction: row;
}

.popDeleteContainer {
  padding-top: 2%;
}
.popDeleteButtons {
  padding: 2%;
}
.popDeleteButton {
  width: 48%;
  margin: 1%;
  padding: 1.5%;
  border-radius: 10px;
  border: 0px;
}
#popDeleteYes {
  background-color: #171717;
  color: #eeeeee;
}
#popDeleteCancel {
  background-color: #171717;
  color: #eeeeee;
}</style>
