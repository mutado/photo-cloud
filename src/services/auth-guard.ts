import App from '@/App.vue'
import User from '@/models/User'
import { VueElement } from 'vue'

export default function authGuard() {
  if (User.isAuthenticated()) {
    return true
  } else {
    return { path: '/auth/login' }
  }
}
