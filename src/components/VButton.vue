<template>
  <button
    :type="submit ? 'submit' : 'button'"
    :class="[
      'v-button',
      {
        'v-button--primary': primary,
        'v-button--secondary': secondary,
        'v-button--danger': danger,
        'v-button--disabled': disabled
      }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'VButton',
  emits: ['click'],
  props: {
    submit: {
      type: Boolean,
      default: false
    },
    primary: {
      type: Boolean,
      default: false
    },
    secondary: {
      type: Boolean,
      default: false
    },
    danger: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>
