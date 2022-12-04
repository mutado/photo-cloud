<template>
  <div class="wrapper" ref="container">
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
        @click="select(photo.id)"
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
      inputMessageText: ''
    }
  },
  mounted() {
    Photo.index().then(() => {
      this.$refs.container.parentElement.scrollTop =
        this.$refs.container.parentElement.scrollHeight
    })
  },
  methods: {
    select(id: string) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((i: string) => i != id)
      } else {
        this.selected.push(id)
      }
      console.log(this.selected)
    }
  },
  computed: {
    photos: () => Photo.all(),
    zoom() {
      return this.$store.state.entities.photos.zoom
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
