<template>
  <picture ref="picture" class="thumbnail" :class="{ skeleton: !imgLoaded }">
    <teleport to="#photo-navigator" :disabled="!active">
      <transition
        :name="animationName"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave=";(animated = true), afterLeave()"
      >
        <div
          v-show="fullScreen"
          class="full-screen-overlay"
          ref="overlay"
          @dblclick="closeFullscreen"
        >
          <img
            class="animate"
            ref="animate"
            v-if="photo?.thumbnail_loaded"
            :src="photo?.thumbnail"
          />
          <img
            class="full"
            ref="full"
            v-if="photo?.image_loaded || photo?.thumbnail_loaded"
            :src="
              animated && fullScreen && photo?.image_loaded
                ? photo?.image
                : photo?.thumbnail
            "
            :class="fullImageClass"
            :style="fullImageStyle"
          />
        </div>
      </transition>
    </teleport>
    <div
      class="miniature"
      v-show="photo?.thumbnail_loaded && (visible || !fullScreen)"
    >
      <img
        :src="photo?.thumbnail"
        :class="renderClass"
        :style="renderStyle"
        ref="img"
        @load="onLoad"
      />
      <i
        class="bi bi-light"
        v-if="!fullScreen && favorite"
        :class="[photo.favorite ? 'bi-heart-fill' : 'bi-heart']"
        @click="toggleFavorite"
      />
    </div>
  </picture>
</template>
<script lang="ts">
import { onIntersect } from '@/composables/onIntersect'
import Photo from '@/models/Photo'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'PhotoThumbnail',
  props: {
    favorite: {
      type: Boolean,
      default: false
    },
    photo_id: {
      type: String,
      required: true
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    slide: {
      type: String as PropType<string | null>,
      required: false,
      default: null
    }
  },
  data() {
    return {
      imgLoaded: false,
      visible: false,
      animated: true,
      active: false,
      observer: null as IntersectionObserver | null
    }
  },
  mounted() {
    console.log('mounted')
    this.observer = onIntersect(
      this.$refs.picture,
      (entry) => {
        this.visible = true
      },
      (entry) => {
        this.visible = false
      },
      false,
      { threshold: 0 }
    )
  },
  unmounted() {
    this.observer?.disconnect()
  },
  methods: {
    toggleFavorite() {
      Photo.updateFavorite([this.photo_id], this.photo?.favorite ? false : true)
    },
    closeFullscreen() {
      this.$emit('dblclick')
    },
    onLoad() {
      this.imgLoaded = true
    },
    beforeEnter() {
      this.photo?.image
      if (this.animationName === 'slide') this.active = true
      this.animated = false
    },
    afterEnter() {
      this.active = true
      this.animated = true
    },
    beforeLeave() {
      if (this.animationName === 'fade') this.active = false
      this.animated = false
    },
    enter() {
      const parent = document.getElementById('main-section')
      // this.$refs.overlay.style.top = parent?.getBoundingClientRect().top + 'px'
      // this.$refs.overlay.style.left =
      //   parent?.getBoundingClientRect().left + 'px'
      if (this.slide == 'left' || this.slide == 'right') {
        console.log('entering', this.slide)
        this.$refs.overlay.style.transform = `translateX(${
          this.slide == 'left' ? '100%' : '-100%'
        })`
        this.$refs.overlay.style.opacity = '0'
        this.$refs.overlay.style.transitionDuration = '0s'
        requestAnimationFrame(() => {
          this.$refs.overlay.style.transitionDuration = null
          this.$refs.overlay.style.transform = `translateX(0)`
          this.$refs.overlay.style.opacity = '1'
        })
        return
      }

      const start = this.getBoundForContainer(this.$refs.img)
      this.setStart(start)
      requestAnimationFrame(() => {
        const dest = this.getBoundForContainer(this.$refs.full)
        this.setDestination(start, dest)
      })
    },
    leave() {
      if (this.slide == 'left' || this.slide == 'right') {
        console.log('leaving', this.slide)
        requestAnimationFrame(() => {
          this.$refs.overlay.style.transitionDuration = null
          this.$refs.overlay.style.transform = `translateX(${
            this.slide == 'left' ? '100%' : '-100%'
          })`
          this.$refs.overlay.style.opacity = '0'
        })
        return
      }
      const start = this.getBoundForContainer(this.$refs.full)
      this.setStart(start)
      this.animated = false
      requestAnimationFrame(() => {
        const dest = this.getBoundForContainer(this.$refs.img)
        console.log('dest', dest)
        this.setDestination(start, dest)
        this.animated = true
      })
    },
    afterLeave() {
      if (this.animationName === 'slide') this.active = false
      this.$refs.overlay.style.transform = null
      this.$refs.overlay.style.opacity = null
    },
    getBoundForContainer(el: any) {
      const bound = el.getBoundingClientRect()
      const parentBound = document
        .getElementById('main-section')!
        .getBoundingClientRect()
      console.log('bound', bound, 'parent', parentBound)

      return {
        left: bound.left - parentBound.left,
        top: bound.top - parentBound.top,
        width: bound.width,
        height: bound.height
      }
    },
    setStart(start: any) {
      const el = this.$refs.animate
      el.style.left = start.left + 'px'
      el.style.top = start.top + 'px'
      el.style.width = start.width + 'px'
      el.style.height = start.height + 'px'
      el.style.transitionDuration = '0s'
      el.style.transform = ''
    },
    setDestination(start: any, dest: any) {
      const el = this.$refs.animate
      el.style.transitionDuration = null

      const translate = `translate(${dest.left - start.left}px, ${
        dest.top - start.top
      }px)`
      const scale = `scale(${dest.width / start.width}, ${
        dest.height / start.height
      })`
      el.style.transform = `${translate} ${scale}`
    }
  },
  computed: {
    fullImageStyle() {
      return {
        maxWidth: this.photo?.width + 'px',
        maxHeight: this.photo?.height + 'px'
      }
    },
    fullImageClass() {
      if (!this.photo) return { square: true }
      return {
        landscape: this.photo?.width > this.photo?.height,
        portrait: this.photo?.width < this.photo?.height,
        square: this.photo?.width === this.photo?.height,
        visible: this.animated && this.fullScreen && this.photo?.image_loaded
      }
    },
    animationName() {
      if (this.slide === 'left' || this.slide === 'right') return 'slide'
      return 'fade'
    },
    renderStyle() {
      return {
        transform: 'scale(' + this.scale + ') translateZ(1px)'
      }
    },
    photo() {
      return Photo.find(this.photo_id)
    },
    aspectRatio() {
      return !this.$store.state.entities.photos.center_image
    },
    renderClass() {
      if (!this.photo)
        return {
          square: true
        }
      return {
        landscape: this.photo?.width > this.photo?.height,
        portrait: this.photo?.width < this.photo?.height,
        square: this.photo?.width === this.photo?.height,
        hidden: !this.animated || this.fullScreen
      }
    },
    scale() {
      if (!this.photo || this.aspectRatio || !this.isLoaded) return 1
      return this.photo?.width > this.photo?.height
        ? this.photo?.width / this.photo?.height
        : this.photo?.height / this.photo?.width
    },
    isLoaded() {
      return this.photo?.thumbnail_loaded
    }
  }
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: background-color 400ms ease-in-out;
}
.slide-leave-active,
.slide-enter-active {
  transition: 300ms ease-in-out;
  transition-property: transform, opacity;
}
.fade-enter-from.full-screen-overlay,
.fade-leave-to.full-screen-overlay {
  background-color: rgba(128, 128, 128, 0);
}

.full-screen-overlay.fade-enter-active img.animate,
.full-screen-overlay.fade-leave-active img.animate {
  display: block;
  transition: transform 300ms ease-in-out;
}

.fade-enter-active + .miniature,
.fade-enter-to + .miniature,
.fade-leave-from + .miniature,
.fade-leave-active + .miniature,
img.hidden {
  visibility: hidden;
}

.fade-enter-active img.full,
.fade-leave-active img.full {
  visibility: hidden;
}

.full-screen-overlay {
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
  z-index: 1;
  user-select: none;
}

.full-screen-overlay img.full {
  filter: blur(2px);
  transition: 200ms filter;
  z-index: 10;
}

.full-screen-overlay img.full.visible {
  filter: blur(0px);
}

.slide-enter-active img.full,
.slide-enter-from img.full {
  filter: blur(1px);
  image-rendering: pixelated;
}

.full-screen-overlay img.animate {
  position: absolute;
  display: none;
  opacity: 1;
  transform-origin: top left;
  filter: blur(1px);
}

.thumbnail {
  aspect-ratio: 1/1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  opacity: 1;
  transition: 0.5s opacity;

  border-color: transparent;
}

.thumbnail .miniature {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.thumbnail i {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.thumbnail i.bi-heart {
  opacity: 0;
  transition: 0.1s opacity ease-in-out;
}
.thumbnail:hover i.bi-heart {
  opacity: 1;
}

.thumbnail.selected {
  outline: 3px solid #0062ff;
}

img {
  display: block;
  transition: 0.1s ease-out, transform 0.5s;
  background-color: rgba(128, 128, 128, 0.5);
  image-rendering: crisp-edges;
}
.landscape {
  width: 100%;
  height: auto;
}
.portrait {
  width: auto;
  height: 100%;
}
.square {
  width: 100%;
  aspect-ratio: 1/1;
}

.landscape.center {
  width: auto;
  height: 100%;
}
.portrait.center {
  width: 100%;
  height: auto;
}

.enlarge .img {
  visibility: hidden;
}

.hidden {
  visibility: hidden;
}
</style>
