<template>
  <section>
    <p>{{ total_photos }} Photos, 2 Videos</p>
    <small>{{ disk_used_percent }}% used</small>
  </section>
</template>
<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhotoStats',
  computed: {
    total_photos() {
      return this.$store.state.entities.photos.count
    },
    disk_used_percent() {
      return this.$store.state.entities.photos.disk_used_percent
    }
  }
})
</script>
