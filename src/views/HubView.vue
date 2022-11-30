<template>
  <div id="Hub">
    <Header />
    <div class="content">
      <Sidebar />
      <div>
        <router-view />
      </div>
    </div>
  </div>
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
  }
})
</script>
<style scoped>
.content {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 20px;
}
</style>
