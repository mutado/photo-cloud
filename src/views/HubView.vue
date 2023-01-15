<template>
  <Header />
  <div class="content">
    <Sidebar class="sidebar" :class="{ open: sidebar }" />
    <section id="main-section">
      <!-- <div id="presenter-view"></div> -->
      <router-view />
    </section>
  </div>
</template>

<script lang="ts">
import Header from '@/components/AppHeader.vue'
import Sidebar from '@/components/AppSidebar.vue'
import Photo from '@/models/Photo'
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
    },
    scrl() {
      console.log(this.$refs.testing?.scrollTop)

      return this.$refs.testing?.scrollTop ?? 0
    }
  },
  data() {
    return {
      loadNextPage: false
    }
  },
  methods: {
    onScroll() {
      Photo.commit((state) => {
        state.scrollTop = this.$refs.scroller.scrollTop
      })
    }
  }
})
</script>
<style scoped>
#presenter-view {
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
#presenter-view > * {
  transform: none !important;
}
#main-section {
  position: relative;
  transform-origin: center center;
}
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
