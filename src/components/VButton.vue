<template>
  <button
    :type="submit ? 'submit' : 'button'"
    :class="[
      'v-button',
      {
        'v-button--primary': primary,
        'v-button--secondary': secondary,
        'v-button--danger': danger,
        'v-button--disabled': disabled,
        'v-button--sidebar': sidebar,
        'router-link-active':
          to != '' ? $route.matched.some(({ path }) => path === to) : false
      }
    ]"
    :disabled="disabled"
    @click="onClick"
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
    },
    sidebar: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ''
    }
  },
  methods: {
    onClick() {
      if (this.to) {
        this.$router.push(this.to)
      }
      this.$emit('click')
    }
  }
})
</script>
