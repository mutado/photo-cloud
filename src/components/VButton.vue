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
        'router-link-active': routeMatched
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
      type: [Object, String],
      default: null
    }
  },
  methods: {
    onClick($event: MouseEvent) {
      if (this.to) {
        this.$router.push(this.to)
      }
      this.$emit('click', $event)
    }
  },
  computed: {
    routeMatched() {
      if (!this.to) return false

      if (this.to instanceof String) {
        return this.$route.matched.some(({ path }) => path === this.to)
      } else if (this.to instanceof Object) {
        return this.$route.matched.some(
          ({ name }) => name === (this.to as any).name
        )
      }

      return this.$route.path === this.to
    }
  }
})
</script>
