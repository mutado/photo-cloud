<template>
  <picture
    class="thumbnail"
    :class="{ skeleton: !imgLoaded }"
    v-observe-visibility="changed"
  >
    <!-- v-show="photo && isLoaded" -->
    <img
      v-if="photo?.thumbnail_loaded"
      ref="img"
      :src="photo?.thumbnail"
      :class="renderClass"
      :style="{ transform: 'scale(' + scale + ') translateZ(1px)' }"
      @load="onLoad"
    />
  </picture>
</template>
<script lang="ts">
import Photo from '@/models/Photo'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoThumbnail',
  props: {
    photo_id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgLoaded: false
    }
  },
  mounted() {
    // this.photo?.thumbnail
  },
  methods: {
    onLoad() {
      this.imgLoaded = true
    },
    changed(isVisible: boolean, entry: IntersectionObserverEntry) {
      if (isVisible) {
        this.photo?.thumbnail
      }
    }
  },
  computed: {
    photo() {
      return Photo.find(this.photo_id)
    },
    aspectRatio() {
      return !this.$store.state.entities.photos.center_image
    },
    renderClass() {
      if (!this.photo || !this.isLoaded)
        return {
          square: true
        }
      return {
        landscape: this.photo?.width > this.photo?.height,
        portrait: this.photo?.width < this.photo?.height,
        square: this.photo?.width === this.photo?.height
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
.thumbnail {
  aspect-ratio: 1/1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  /*border: 3px solid transparent;*/
}

.thumbnail.selected {
  outline: 3px solid #2679fb;
}
img {
  display: block;
  transition: 0.3s ease-out;
  background-color: gray;
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
  height: 100%;
}

.landscape.center {
  width: auto;
  height: 100%;
}
.portrait.center {
  width: 100%;
  height: auto;
}
</style>
