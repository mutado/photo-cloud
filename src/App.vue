<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import User from '@/models/User'

export default defineComponent({
  name: 'App',
  mounted() {
    console.log(User.isAuthenticated())
    console.log(process.env.VUE_APP_BASE_URL)
  }
})
</script>
<style></style>
