<template>
  <aside>
    <small class="color-secondary"><b>Photos</b></small>
    <v-button class="bar" sidebar to="/photos">
      <i class="bi bi-images"></i>
      Library
    </v-button>
    <v-button class="bar" sidebar to="/photos/places">
      <i class="bi bi-images"></i>
      Places
    </v-button>
    <v-button class="bar" sidebar to="/photos/favorites">
      <i class="bi bi-heart-fill"></i>
      Favorites
    </v-button>
    <v-button class="bar" sidebar to="/photos/recents">
      <i class="bi bi-images"></i>
      Recents
    </v-button>
    <v-button class="bar" sidebar to="/photos/deleted">
      <i class="bi bi-images"></i>
      Deleted
    </v-button>

    <small class="color-secondary"><b>Albums</b></small>
    <!-- <v-button class="bar" sidebar>
      <i class="bi bi-people-fill"></i>
      Shared
    </v-button> -->
    <v-button class="bar" sidebar to="/albums">
      <i class="bi bi-folder-fill"></i>
      My Albums
    </v-button>
    <v-button
      class="bar"
      sidebar
      v-for="folder in folders"
      :to="'/albums/' + folder.id + '/photos'"
    >
      <i class="bi bi-collection"></i>
      <!-- <img v-else :src="folder.thumbnail" /> -->
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-collection"
        viewBox="0 0 16 16"
      >
        <path
          d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z"
        />
      </svg> -->
      {{ folder.name }}
    </v-button>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VButton from '@/components/VButton.vue'
import Folder from '@/models/Folder'

export default defineComponent({
  name: 'AppSidebar',
  components: {
    VButton
  },
  computed: {
    folders() {
      return Folder.all()
    }
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
