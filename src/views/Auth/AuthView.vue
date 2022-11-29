<template>
  <div class="wrapper">
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthView'
})
</script>
<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.content {
  min-width: 500px;
  width: 30%;
  background-color: #fff;
}
</style>
