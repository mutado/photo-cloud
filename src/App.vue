<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import User from '@/models/User'
import axios from 'axios'
import Photo from './models/Photo'
import Folder from './models/Folder'

export default defineComponent({
  name: 'App',
  mounted() {
    if (User.isAuthenticated()) {
      let user = User.me()
      User.insert({ data: user.user })
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
      console.log('user is authenticated, header is set')

      Photo.stats()
      Folder.index()
      Photo.index(1)
    }
    console.log(process.env.VUE_APP_BASE_URL)
  }
})
</script>
