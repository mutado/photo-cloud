<template>
  <teleport to="#toolbar">
    <template v-if="!fullScreen">
      <zoom-control aspect-ratio />
      <div class="headerChild">
        <v-button
          :disabled="!selected.length"
          @click="
            toggleFavorite(
              selectedPhotos.map((ph) => ph.id),
              selectedPhotos.some((ph) => ph.favorite === false)
            )
          "
        >
          <i
            class="bi bi-light"
            :class="[
              selected.length &&
              selectedPhotos.every((ph) => ph.favorite === true)
                ? 'bi-heart-fill'
                : 'bi-heart'
            ]"
          ></i>
        </v-button>
        <VDropdown>
          <v-button
            :disabled="!selected.length"
            @click="deletePhotos(selected)"
          >
            <i class="bi bi-light bi-trash3"></i>
          </v-button>
        </VDropdown>
      </div>
    </template>
    <template v-else>
      <v-button @click="openFullscreen(fullScreen)" class="bi-light">
        <i class="bi bi-light bi-chevron-left"></i>
        Back
      </v-button>
      <div class="headerChild">
        <v-button
          @click="
            toggleFavorite([fullScreenPhoto.id], !fullScreenPhoto.favorite)
          "
        >
          <i
            class="bi bi-light"
            :class="[fullScreenPhoto?.favorite ? 'bi-heart-fill' : 'bi-heart']"
          ></i>
        </v-button>
        <VDropdown>
          <v-button @click="deletePhotos([fullScreenReference.id])">
            <i class="bi bi-light bi-trash3"></i>
          </v-button>
        </VDropdown>
      </div>
    </template>
  </teleport>
  <transition name="fade" v-if="photoReferences">
    <div
      id="photo-navigator"
      class="overlay"
      v-show="fullScreen !== null"
      ref="overlay"
      v-hot.left="navigatePrev"
      v-hot.right="navigateNext"
      v-hot.esc="closeFullscreen"
    >
      <div
        class="navigate navigate-left"
        v-if="
          photoReferences.findIndex((ph) => ph.id == fullScreen) !==
          photoReferences.length - 1
        "
      >
        <v-button @click.stop="navigatePrev">
          <i class="bi bi-light bi-chevron-left"></i>
        </v-button>
      </div>
      <div
        class="navigate navigate-right"
        v-if="photoReferences.findIndex((ph) => ph.id == fullScreen) !== 0"
      >
        <v-button @click.stop="navigateNext">
          <i class="bi bi-light bi-chevron-right"></i>
        </v-button>
      </div>
      <transition name="slide-navigator" @after-enter="navigatorEnter">
        <div class="photo-navigator" v-show="fullScreen !== null">
          <i class="bi bi-light bi-caret-down-fill"></i>
          <div class="photos-list" @scroll="navigatorScroll">
            <div class="photos-container">
              <div
                ref="navigator-photos"
                v-for="photo in photoReferences.slice().reverse()"
                :data-id="photo.id"
                :key="photo.id"
                @click="navigatorOpen(photo.id)"
                :class="{ selected: fullScreen === photo.id }"
              >
                <img :src="photo?.photo.thumbnail" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
  <div
    v-if="photoReferences && photoReferences.length"
    class="wrapper"
    ref="container"
    :class="{ fullScreen: fullScreen }"
  >
    <items-grid class="pos-relative">
      <photo-thumbnail
        favorite
        ref="photos"
        :data-id="photoRef.id"
        v-for="photoRef in photoReferences!.slice().reverse()"
        :key="photoRef.id"
        :photo_id="photoRef.photo_id"
        :full-screen="fullScreen !== null && fullScreen === photoRef.id"
        @dblclick="openFullscreen(photoRef.id)"
        :slide="
          slideLeft === photoRef.id
            ? 'left'
            : slideRight === photoRef.id
            ? 'right'
            : null
        "
        v-selectable:[photoRef.id]="{
          getItems: getPhotoIds,
          setSelection: setSelection,
          getSelection: getSelection,
          isEnabled: () => true
        }"
        :class="{
          selected: selected.includes(photoRef.id),
          'visually-hidden': fullScreen !== null && fullScreen !== photoRef.id,
          enlarge: fullScreen === photoRef.id
        }"
      />
    </items-grid>
  </div>
  <div v-else class="wrapper">
    <div class="empty">
      <i class="bi bi-light bi-image"></i>
      <p>No photos in this album</p>
    </div>
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
import Photo from '@/models/Photo'
import ConfirmDialog from '@/components/Modals/ConfirmDialog.vue'

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
      selected: [] as string[],
      fullScreen: null as string | null,
      slideLeft: null as string | null,
      slideRight: null as string | null
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
    deletePhotos(selected: string[]) {
      this.$modal
        .show(ConfirmDialog, {
          props: {
            title: `Remove ${selected.length} photo${
              selected.length > 1 ? 's' : ''
            } from album?`,
            message: `This photo${
              selected.length > 1 ? 's' : ''
            } will be removed from this album, but will remain in your photo library.`,
            confirmText: 'Delete',
            dismissText: 'Cancel',
            ctaButton: 'success'
          }
        })
        .then((confirmed: boolean) => {
          if (confirmed) {
            FolderPhoto.destroy(this.folderId, selected).then(() => {
              this.openFullscreen(null)
            })
          }
        })
    },
    navigatePrev() {
      if (this.fullScreen === null) return
      this.openFullscreen(1)
    },
    navigateNext() {
      if (this.fullScreen === null) return
      this.openFullscreen(-1)
    },
    navigatorEnter() {
      this.navigatorScrollTo(this.fullScreen as string, true)
    },
    navigatorScrollTo(photo_id: string, smooth: boolean = true) {
      console.log('Scrolling to ' + photo_id)
      let nav = this.$refs['navigator-photos'].find(
        (el: any) => el.getAttribute('data-id') === photo_id
      )
      requestAnimationFrame(() => {
        nav.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'center',
          inline: 'center'
        })
      })
    },
    navigatorOpen(photo_id: string) {
      this.openFullscreen(photo_id, true)
    },
    navigatorScroll($event: any) {
      console.log($event)
    },
    openFullscreen(photo_id: string | number | null, slide: boolean = false) {
      if (typeof photo_id === 'number' || slide === true) {
        console.log('Opening fullscreen with slide')

        let index = this.photoReferences!.findIndex(
          (ph) => ph.id == this.fullScreen
        )
        let newIndex = 0
        if (typeof photo_id === 'number') {
          newIndex = index + photo_id
          if (newIndex < 0 || newIndex >= this.photoReferences!.length) {
            console.log('Index out of bounds. Aborting.')
            return
          }
        } else {
          newIndex = this.photoReferences!.findIndex((ph) => ph.id == photo_id)
        }
        let newId = this.photoReferences![newIndex].id
        this.slideLeft = index < newIndex ? this.fullScreen : newId
        this.slideRight = index > newIndex ? this.fullScreen : newId
        this.navigatorScrollTo(newId as string)
        this.fullScreen = newId
        return
      }
      if (this.fullScreen === photo_id) {
        this.closeFullscreen()
        return
      }
      this.slideLeft = null
      this.slideRight = null
      this.setSelection([])
      this.fullScreen = photo_id
      console.log('Photo is now fullscreen.')
    },
    closeFullscreen() {
      if (this.fullScreen === null) return
      this.slideLeft = null
      this.slideRight = null
      this.setSelection([])
      // scroll to the photo
      console.log('Photo is already fullscreen, closing it.')
      let nav = this.$refs['photos'].find(
        (el: any) => el.$el.getAttribute('data-id') === this.fullScreen
      ).$el

      nav.scrollIntoView({
        block: 'center',
        inline: 'center'
      })
      console.log('Scrolling to ' + this.fullScreen)

      requestAnimationFrame(() => {
        this.fullScreen = null
        console.log('Photo is no longer fullscreen.')
      })
    },
    toggleFavorite(ids: string[], favorite: boolean) {
      Photo.updateFavorite(ids, favorite)
    }
  },
  mounted() {
    Folder.show(this.$route.params.id as string).then(() => {
      this.loaded = true
    })
  },
  computed: {
    folderId(): string {
      return this.$route.params.id as string
    },
    photoReferences(): FolderPhoto[] {
      return this.folder?.photo_references as FolderPhoto[]
    },
    folder(): Item<Folder> {
      return Folder.query().with('photo_references.photo').find(this.folderId)
    },
    selectedReferences(): FolderPhoto[] {
      return this.photoReferences?.filter((photo) =>
        this.selected.includes(photo.id)
      )
    },
    selectedPhotos(): Photo[] {
      return Photo.query()
        .whereIdIn(this.selectedReferences.map((ref) => ref.photo_id))
        .get()
    },
    fullScreenReference(): FolderPhoto | null {
      if (this.fullScreen === null) return null
      return FolderPhoto.query().whereId(this.fullScreen).with('photo').first()
    },
    fullScreenPhoto(): Photo | null {
      if (this.fullScreenReference === null) return null
      return this.fullScreenReference.photo
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

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
  color: #ccc;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms;
}

.fade-enter-from.overlay,
.fade-leave-to.overlay {
  opacity: 0;
}
.slide-navigator-enter-active {
  transition-delay: 100ms;
}
.slide-navigator-enter-active,
.slide-navigator-leave-active {
  transition: transform 300ms;
}

.slide-navigator-enter-from.photo-navigator,
.slide-navigator-leave-to.photo-navigator {
  transform: translateY(100%);
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-y: auto;
  z-index: 2;
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
  height: 30vh;
}

.overlay {
  opacity: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: rgba(21, 21, 21, 1);
}

.overlay .navigate {
  position: absolute;
  height: calc(100% - 100px);
  top: 0;
  margin: 0;
  transition: opacity 150ms ease;
  opacity: 0;
  display: flex;
  align-items: center;
  z-index: 999;
  padding: 0 10px;
}

.overlay .navigate:hover {
  opacity: 1;
}

.overlay .navigate-left {
  left: 0;
}
.overlay .navigate-right {
  right: 0;
}

.overlay .navigate button {
  padding: 6px 8px;
  border-radius: 3px;
  margin: 0 10px;
}
.overlay .navigate:hover button {
  background-color: rgba(21, 21, 21, 0.8);
}

.photo-navigator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(0);
  height: 100px;
  background-color: rgba(98, 98, 98, 1);
}

.photo-navigator > i {
  position: fixed;
  display: block;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.photos-list {
  display: flex;
  overflow: auto;
  height: 100%;
  padding: 10px 0;
}

.photos-list::-webkit-scrollbar {
  height: 3px;
}
.photos-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-end;
  padding: 0 calc(50% - 25px);
  gap: 5px;
}
.photos-container > div {
  height: 90%;
  width: 50px;
}

.photos-container > div > img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.slide-navigator-enter-active img,
.slide-navigator-leave-active img {
  filter: blur(2px);
}
</style>
