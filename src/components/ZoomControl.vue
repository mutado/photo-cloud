<template>
  <div class="render">
    <v-button v-if="aspectRatio">
      <i
        v-if="ratio"
        @click="ratio = false"
        class="bi bi-light bi-arrows-angle-contract"
      ></i>
      <i
        v-else
        @click="ratio = true"
        class="bi bi-light bi-arrows-angle-expand"
      ></i>
    </v-button>
    <v-range v-model="zoom" :min="3.99" :max="9.1" :step="0.1" />
  </div>
</template>
<script lang="ts">
import Photo from '@/models/Photo'
import VRange from '@/components/VRange.vue'
import VButton from '@/components/VButton.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ZoomControl',
  components: {
    VRange,
    VButton
  },
  props: {
    aspectRatio: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    zoom: {
      get() {
        return this.$store.state.entities.photos.zoom
      },
      set(value: number) {
        let r = Math.floor(value)
        if (r != Math.floor(this.zoom))
          Photo.commit((state) => {
            state.zoom = value
          })
      }
    },
    ratio: {
      get() {
        return this.$store.state.entities.photos.center_image
      },
      set(value: number) {
        Photo.commit((state) => {
          state.center_image = value
        })
      }
    }
  }
})
</script>
<style scoped>
.render {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
@media screen and (max-width: 768px) {
  .render {
    display: none !important;
  }
}
</style>
