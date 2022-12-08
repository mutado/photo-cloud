<template>
  <aside>
    <small class="color-secondary"><b>Photos</b></small>
    <v-button class="bar" sidebar to="/photos">
      <i class="bi bi-images"></i>
      Library
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-images"></i>
      Places
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-star-fill"></i>
      Favorites
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-images"></i>
      Recents
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-images"></i>
      Deleted
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-images"></i>
      Hidden
    </v-button>

    <small class="color-secondary"><b>Photos</b></small>
    <v-button class="bar" sidebar to="/albums">
      <i class="bi bi-folder-fill"></i>
      My Albums
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-people-fill"></i>
      Shared
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-images"></i>
      Videos
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-images"></i>
      Photos
    </v-button>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VButton from '@/components/VButton.vue'

export default defineComponent({
  name: 'AppSidebar',
  components: {
    VButton
  }
})
</script>

<style scoped>
aside {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.99);
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}
small {
  margin-top: 30px;
  margin-bottom: 5px;
}
</style>
