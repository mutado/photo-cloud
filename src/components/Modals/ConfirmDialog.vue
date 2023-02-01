<template>
  <div>
    <div class="header">
      <img src="@/assets/logo@1x.svg" alt="logo" />
      <div>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
      </div>
    </div>
    <div class="buttons">
      <v-button danger @click="yes" :class="{ cta: ctaButton == 'success' }">
        {{ confirmText }}
      </v-button>
      <v-button success @click="no" :class="{ cta: ctaButton == 'danger' }">
        {{ dismissText }}
      </v-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import VButton from '@/components/VButton.vue'

export default defineComponent({
  components: {
    VButton
  },
  name: 'ConfirmDialog',
  emits: ['close', 'dismiss'],
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Yes'
    },
    dismissText: {
      type: String,
      default: 'No'
    },
    ctaButton: {
      type: String,
      default: false
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
<style scoped>
.header {
  display: flex;
  align-items: center;
}
.header > img {
  height: 90px;
  margin-right: 20px;
}
.header > * {
  margin: 0;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}

.cta {
  order: 1;
}
</style>
