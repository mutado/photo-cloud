<template>
  <teleport to="#toolbar">
    <zoom-control aspect-ratio />
    <div class="headerChild">
      <v-button @click="choosePhotos">
        <i class="bi bi-light bi-cloud-upload"></i>
      </v-button>
      <VDropdown>
        <v-button :disabled="!selected.length">
          <i class="bi bi-light bi-folder-plus"></i>
        </v-button>
        <template #popper>
          <div class="popFoldersMessage">Add photos to folder</div>
          <div
            class="popFolders"
            ref="folder"
            v-for="(folder, index) in folders"
            @click="addToFolder(index)"
            v-close-popper
          >
            <i class="bi bi-collection"></i>
            {{ folder.name }}
          </div>
        </template>
      </VDropdown>
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
              Are you sure you want to delete these photos?
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
  <div class="wrapper" ref="container">
    <items-grid>
      <photo-thumbnail
        v-for="photo in photos.slice().reverse()"
        :photo_id="photo.id"
        :key="photo.id"
        v-selectable:[photo.id]="{
          getItems: getPhotoIds,
          setSelection: setSelection,
          getSelection: getSelection
        }"
        :class="{ selected: selected.includes(photo.id) }"
        @dblclick="openPhoto(photo.id)"
      />
    </items-grid>
    <photo-stats ref="stats" />
    <input
      @input="submitPhotos"
      id="fileUpload"
      type="file"
      ref="fileUpload"
      accept="image/png, image/jpeg"
      hidden
    />
  </div>
</template>
<script lang="ts">
import PhotoThumbnail from '@/components/PhotoThumbnail.vue'
import VButton from '@/components/VButton.vue'
import Photo from '@/models/Photo'
import PhotoStats from '@/components/PhotoStats.vue'
import ZoomControl from '@/components/ZoomControl.vue'
import ItemsGrid from '@/components/ItemsGrid.vue'
import VSelectable from '@/components/VSelectable.vue'
import { defineComponent } from 'vue'
import router from '@/router'
import Folder from '@/models/Folder'
import FolderPhoto from '@/models/FolderPhoto'

export default defineComponent({
  components: {
    PhotoThumbnail,
    PhotoStats,
    ZoomControl,
    VButton,
    ItemsGrid,
    VSelectable
  },
  data() {
    return {
      imgs: [],
      imageAdded: false,
      inputMessageText: '',
      loadingHandler: null as any,
      selected: [] as string[]
    }
  },
  mounted() {
    this.loadMore().then(() => {
      this.scrollToBottom()
    })
    this.scrollToBottom()
    Folder.index()
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
    },
    loadMore() {
      return (this.loadingHandler = Photo.index(this.photoPage).then(() => {
        this.loadingHandler = null
      }))
    },
    scrollToBottom() {
      this.$refs.container.parentElement.scrollTop =
        this.$refs.container.parentElement.scrollHeight
    },
    openPhoto(id: string) {
      router.push('/photos/' + id)
    },
    choosePhotos() {
      document.getElementById('fileUpload')!.click()
    },
    submitPhotos() {
      Photo.upload(this.$refs.fileUpload.files[0])
      this.$refs.fileUpload.value = null
    },
    addToFolder(index: number) {
      this.getSelection().forEach((photo_id: string) => {
        FolderPhoto.post(this.folders[index].id, photo_id)
      })
    },
    deletePhotos() {
      this.getSelection().forEach((photo_id: string) => {
        Photo.destroy(photo_id)
      })
    }
  },
  watch: {
    scrollTop(val) {
      console.log('scrolltop', val)
      if (val < 100 && this.loadingHandler == null) {
        console.log(this.photoPage)

        console.log('loading more')
        this.loadMore()
      }
    }
  },
  computed: {
    photos: () => Photo.query().orderBy('created_at', 'desc').get(),
    folders() {
      return Folder.all()
    },
    zoom() {
      return Math.floor(this.$store.state.entities.photos.zoom)
    },
    photoPage() {
      return this.$store.state.entities.photos.page
    },
    photoCount() {
      return this.$store.state.entities.photos.count
    },
    scrollTop() {
      return this.$store.state.entities.photos.scrollTop
    }
  }
})
</script>
<style scoped>
.grid {
  padding: 20px;
  display: grid;
  gap: 10px;
  transition: 0.5s ease-out;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
@media screen and (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
  }
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
photo-stats {
  margin-top: auto;
}

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
}

.popFoldersMessage {
  padding-top: 2%;
}
.popFolders {
  border: #171717 solid 1px;
  border-radius: 5px;
  margin: 1%;
  padding: 1%;
}
</style>
