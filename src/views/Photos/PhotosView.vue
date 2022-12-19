<template>
  <button @click="loadMore" :disabled="photos.length >= photoCount">
    load more {{ photos.length }}
  </button>
  <div class="wrapper" ref="container" @scroll="onScroll">
    <div
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${12 - zoom},1fr)`
      }"
    >
      <photo-thumbnail
        v-for="photo in photos.slice().reverse()"
        :key="photo.id"
        :photo_id="photo.id"
        :class="{ selected: selected.includes(photo.id) }"
        @click.exact="selected = [photo.id]"
        @click.meta.exact="addToSelection(photo.id)"
        @click.shift.exact="selectMultiple(photo.id)"
      />
    </div>
    <photo-stats ref="stats" />
  </div>
</template>
<script lang="ts">
import PhotoThumbnail from '@/components/PhotoThumbnail.vue'
import Photo from '@/models/Photo'
import PhotoStats from '@/components/PhotoStats.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { PhotoThumbnail, PhotoStats },
  data() {
    return {
      imgs: [],
      imageAdded: false,
      inputMessageText: '',
      loadingHandler: null as any
    }
  },
  mounted() {
    this.loadMore().then(() => {
      this.scrollToBottom()
    })
    this.scrollToBottom()
  },
  methods: {
    loadMore() {
      return (this.loadingHandler = Photo.index(this.photoPage).then(() => {
        this.loadingHandler = null
      }))
    },
    scrollToBottom() {
      this.$refs.container.parentElement.scrollTop =
        this.$refs.container.parentElement.scrollHeight
    },
    addToSelection(id: string, removeOnOverlap = true) {
      if (this.selected.includes(id)) {
        if (removeOnOverlap)
          this.selected = this.selected.filter((i: string) => i != id)
      } else {
        this.selected.push(id)
      }
    },
    selectMultiple(id: string) {
      // select all photos between the last selected photo and the current photo
      const start = this.photos.findIndex(
        (photo) => photo.id == this.selected[this.selected.length - 1]
      )
      let end = this.photos.findIndex((photo) => photo.id == id)
      if (end > start) end += 1
      const test = this.photos.slice(Math.min(start, end), Math.max(start, end))

      test.forEach((photo) => {
        this.addToSelection(photo.id, false)
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
    zoom() {
      return this.$store.state.entities.photos.zoom
    },
    photoPage() {
      return this.$store.state.entities.photos.page
    },
    photoCount() {
      return this.$store.state.entities.photos.count
    },
    selected: {
      get() {
        return this.$store.state.entities.photos.selected
      },
      set(value) {
        Photo.commit((state) => {
          state.selected = value
        })
      }
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
</style>
