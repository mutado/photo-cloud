<template>
  <aside>
    <v-button class="bar" sidebar to="/photos">
      <i class="bi bi-images"></i>
      Library
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-star-fill"></i>
      Favorites
    </v-button>
    <v-button class="bar" sidebar to="/albums">
      <i class="bi bi-folder-fill"></i>
      Albums
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-people-fill"></i>
      Shared
    </v-button>
    <v-button class="bar" sidebar>
      <i class="bi bi-person-circle"></i>
      Account
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
  width: 100%;
  height: 85%;
  background-color: rgba(247, 246, 246, 0.7);
  border-radius: 30px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 20px;
}
aside > * {
  border-radius: 15px;
}
</style>
