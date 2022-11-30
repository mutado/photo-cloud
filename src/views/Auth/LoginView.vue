<template>
  <v-form @submit="login">
    <v-input label="email" required type="email" v-model="user.email" />
    <v-input label="pass" required v-model="user.password" />
    <v-button submit>Login</v-button>
  </v-form>
  <router-link :to="{ name: 'forgot' }">forgot password</router-link>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import VInput from '@/components/VInput.vue'
import VButton from '@/components/VButton.vue'
import VForm from '@/components/VForm.vue'
import User from '@/models/User'
export default defineComponent({
  name: 'LoginView',
  components: {
    VInput,
    VButton,
    VForm
  },
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      User.login(this.user.email, this.user.password)
        .then(() => {
          this.$router.push({ name: 'home' })
        })
        .catch(() => {
          console.log('invalid login or password')
        })
    }
  }
})
</script>
