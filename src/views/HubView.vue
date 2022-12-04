<template>
  <!-- <div id="Hub"> -->
  <Header />
  <div class="content">
    <Sidebar class="sidebar" :class="{ open: sidebar }" />
    <section>
      <router-view />
    </section>
  </div>
  <!-- </div> -->
</template>

<script lang="ts">
import Header from '@/components/AppHeader.vue'
import Sidebar from '@/components/AppSidebar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HubView',
  components: {
    Header,
    Sidebar
  },
  computed: {
    sidebar() {
      return this.$store.state.entities.photos.sidebar
    }
  }
})
</script>
<style scoped>
.content {
  display: grid;
  grid-template-columns: 227px 4fr;
}
.sidebar {
  height: calc(100vh - 51px);
  position: sticky;
}
section {
  height: calc(100vh - 51px);
  overflow-y: auto;
  background-color: rgba(21, 21, 21, 0.99);
}
@media screen and (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
  section {
    height: calc(100vh - 99px);
  }
  .sidebar.open {
    right: 0;
  }
  .sidebar {
    position: absolute;
    height: calc(100vh - 99px);
    z-index: 999;
    right: 100%;
    transition: 0.5s ease-out right;
  }
}
</style>
