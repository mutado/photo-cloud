<template>
  <teleport to="#toolbar">
    <template v-if="!fullScreen">
      <zoom-control aspect-ratio />
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
        <v-button :disabled="!selected.length" @click="deleteSelectedPhotos">
          <i class="bi bi-light bi-trash3"></i>
        </v-button>
      </div>
    </template>
    <template v-else>
      <v-button @click="openFullscreen(fullScreen)" class="bi-light">
        <i class="bi bi-light bi-chevron-left"></i>
        Back
      </v-button>
      <div class="headerChild">
        <v-button>
          <i class="bi bi-light bi-folder-plus"></i>
        </v-button>
        <v-button>
          <i class="bi bi-light bi-heart"></i>
        </v-button>
        <v-button>
          <i class="bi bi-light bi-box-arrow-up"></i>
        </v-button>
        <v-button @click="deleteSelectedPhotos">
          <i class="bi bi-light bi-trash3"></i>
        </v-button>
      </div>
    </template>
  </teleport>
  <transition name="fade" @enter="overlayEnter">
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
          photos.findIndex((ph) => ph.id == fullScreen) !== photos.length - 1
        "
      >
        <v-button @click.stop="navigatePrev">
          <i class="bi bi-light bi-chevron-left"></i>
        </v-button>
      </div>
      <div
        class="navigate navigate-right"
        v-if="photos.findIndex((ph) => ph.id == fullScreen) !== 0"
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
                v-for="photo in photos.slice().reverse()"
                :data-id="photo.id"
                :key="photo.id"
                @click="navigatorOpen(photo.id)"
                :class="{ selected: fullScreen === photo.id }"
              >
                <img :src="photo.thumbnail" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
  <div class="wrapper" ref="container" :class="{ fullScreen: fullScreen }">
    <items-grid class="pos-relative">
      <photo-thumbnail
        ref="photos"
        :data-id="photo.id"
        v-for="photo in photos.slice().reverse()"
        :key="photo.id"
        :photo_id="photo.id"
        :full-screen="fullScreen !== null && fullScreen === photo.id"
        @dblclick="openFullscreen(photo.id)"
        :slide="
          slideLeft === photo.id
            ? 'left'
            : slideRight === photo.id
            ? 'right'
            : null
        "
        v-selectable:[photo.id]="{
          getItems: getPhotoIds,
          setSelection: setSelection,
          getSelection: getSelection,
          isEnabled: () => true
        }"
        :class="{
          selected: selected.includes(photo.id),
          'visually-hidden': fullScreen !== null && fullScreen !== photo.id,
          enlarge: fullScreen === photo.id
        }"
      />
    </items-grid>
    <photo-stats ref="stats" />
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
import VModal from '@/components/VModal.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    PhotoThumbnail,
    PhotoStats,
    ZoomControl,
    VButton,
    ItemsGrid,
    VSelectable,
    VModal
  },
  data() {
    return {
      imgs: [],
      imageAdded: false,
      inputMessageText: '',
      loadingHandler: null as any,
      selected: [] as string[],
      fullScreen: null as string | null,
      slideLeft: null as string | null,
      slideRight: null as string | null
    }
  },
  mounted() {
    this.loadMore().then(() => {
      this.scrollToBottom()
    })
    this.scrollToBottom()
  },
  methods: {
    navigatePrev() {
      if (this.fullScreen === null) return
      this.openFullscreen(1)
    },
    navigateNext() {
      if (this.fullScreen === null) return
      this.openFullscreen(-1)
    },
    overlayEnter() {
      // const bound = document
      //   .getElementById('main-section')
      //   ?.getBoundingClientRect()
      // // this.$refs.overlay.style.top = bound?.scrollTop + 'px'
      // this.$refs.overlay.style.top = bound?.top + 'px'
      // this.$refs.overlay.style.left = bound?.left + 'px'
      // this.$refs.overlay.style.width = bound?.width + 'px'
      // this.$refs.overlay.style.height = bound?.height + 'px'
    },
    deleteSelectedPhotos() {
      // let promises = Photo.destroy(this.selected)
      // let finished = 0
      // this.selected = []
      // promises.forEach((promise) => {
      //   promise.then(() => {
      //     finished++
      //     console.log(Math.trunc((finished / promises.length) * 100) + '%')
      //   })
      // })
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

        let index = this.photos.findIndex((ph) => ph.id == this.fullScreen)
        let newIndex = 0
        if (typeof photo_id === 'number') {
          newIndex = index + photo_id
          if (newIndex < 0 || newIndex >= this.photos.length) {
            console.log('Index out of bounds. Aborting.')
            return
          }
        } else {
          newIndex = this.photos.findIndex((ph) => ph.id == photo_id)
        }
        let newId = this.photos[newIndex].id
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
