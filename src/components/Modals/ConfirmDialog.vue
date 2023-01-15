<template>
  {{ title }}
  <button @click="yes">yes</button>
  <button @click="no">no</button>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfirmDialog',
  emits: ['close', 'dismiss'],
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    yes() {
      this.$emit('close', true)
    },
    no() {
      this.$emit('close', false)
    },

    dismiss() {
      this.$emit('dismiss')
    }
  }
})
</script>
