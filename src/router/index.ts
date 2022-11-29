import authGuard from '@/services/auth-guard'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/photos',
    beforeEnter: [authGuard],
    children: [
      {
        path: ':id',
        name: 'photo',
        component: () =>
          import(
            /* webpackChunkName: "photo" */ '../views/Photos/PhotoView.vue'
          )
      },
      {
        path: '',
        name: 'photos',
        component: () =>
          import(
            /* webpackChunkName: "photos" */ '../views/Photos/PhotosView.vue'
          )
      }
    ]
  },
  {
    path: '/albums',
    beforeEnter: [authGuard],
    children: [
      {
        path: ':id',
        name: 'album',
        redirect: { name: 'album-photos' }
      },
      {
        path: ':id/photos',
        name: 'album-photos',
        component: () => import('../views/Albums/AlbumPhotosView.vue')
      },
      {
        path: ':id/photos/:photoId',
        name: 'album-photo',
        component: () => import('../views/Photos/PhotoView.vue')
      },
      {
        path: '',
        name: 'albums',
        component: () =>
          import(
            /* webpackChunkName: "albums" */ '../views/Albums/AlbumsView.vue'
          )
      }
    ]
  },
  {
    path: '/auth',
    redirect: { name: 'login' },
    component: () => import('../views/Auth/AuthView.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () =>
          import(/* webpackChunkName: "login" */ '../views/Auth/LoginView.vue')
      },
      {
        path: 'forgot',
        name: 'forgot',
        component: () =>
          import(
            /* webpackChunkName: "forgot" */ '../views/Auth/ForgotView.vue'
          )
      },
      {
        path: 'shared/:id',
        name: 'shared-auth',
        component: () =>
          import(
            /* webpackChunkName: "shared-auth" */ '../views/Auth/SharedAuthView.vue'
          )
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
