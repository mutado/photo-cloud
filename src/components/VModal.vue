<template>
  <teleport to="body">
    <div v-if="open" id="modal"></div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'VModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data() {
    return {
      open: this.show
    }
  }
})
</script>
<style>
#modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>
