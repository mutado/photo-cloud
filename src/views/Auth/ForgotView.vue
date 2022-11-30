<template>
  <v-input label="email" v-model="email" />
  <v-button @click="reset">Reset</v-button>
  <router-link :to="{ name: 'login' }">login instead</router-link>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import VInput from '@/components/VInput.vue'
import VButton from '@/components/VButton.vue'

export default defineComponent({
  components: {
    VInput,
    VButton
  },
  data() {
    return {
      email: ''
    }
  },
  methods: {
    reset() {
      console.log(this.email)
    }
  }
})
</script>
