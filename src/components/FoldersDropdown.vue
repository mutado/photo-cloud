<template>
  <div class="folders">
    <h2 class="message">
      Add {{ selected.length > 1 ? 'photos' : 'photo' }} to
    </h2>
    <div class="list">
      <v-button
        primary
        v-for="(folder, index) in folders"
        @click="addToFolder(folder)"
        v-close-popper
      >
        <i class="bi bi-collection"></i>
        {{ folder.name }}
      </v-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import Folder from '@/models/Folder'
import FolderPhoto from '@/models/FolderPhoto'
import { computed } from 'vue'
import VButton from './VButton.vue'

const props = defineProps<{
  selected: string[]
}>()

const emits = defineEmits<{
  (event: 'close'): void
}>()

const folders = computed(() => Folder.all())

function addToFolder(folder: Folder) {
  props.selected.forEach((photo_id) => {
    FolderPhoto.post(folder.id, photo_id)
  })
  emits('close')
}
</script>
<style scoped>
.folders {
  width: 30vw;
  max-width: 400px;
  height: 40vh;
  position: relative;
  overflow: hidden;
}
.message {
  text-align: center;
  font-weight: normal;
  overflow: hidden;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  margin: 0;
  background-color: #141414;
}
.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 10px 30px;
  height: 100%;
  overflow-y: auto;
}
.list > * {
  width: 100%;
  text-align: start;
  padding: 5px;
}
</style>
