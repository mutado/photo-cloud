<template>
  <div
    @click.exact="selectSingle(id)"
    @click.meta.exact="addToSelection(id)"
    @click.shift.exact="selectMultiple(id)"
  >
    <slot :class="{ selected: selected.includes(id) }" />
  </div>
</template>
<script lang="ts">
import Photo from '@/models/Photo'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VSelectable',
  props: {
    id: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    selectSingle(id: string) {
      console.log('selectSingle')

      if (this.selected.length == 1 && this.selected[0] == id) {
        this.selected = []
      } else {
        this.selected = [id]
      }
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
      const start = this.items.findIndex(
        (photo: any) => photo.id == this.selected[this.selected.length - 1]
      )
      let end = this.items.findIndex((photo: any) => photo.id == id)
      if (end > start) end += 1
      const test = this.items.slice(Math.min(start, end), Math.max(start, end))

      test.forEach((photo: any) => {
        this.addToSelection(photo.id, false)
      })
    }
  },
  computed: {
    selected: {
      get() {
        return this.$store.state.entities.photos.selected
      },
      set(value: string[]) {
        Photo.commit((state) => {
          state.selected = value
        })
      }
    }
  }
})
</script>
<style scoped>
.selected {
  outline: 3px solid #2679fb;
}
</style>
