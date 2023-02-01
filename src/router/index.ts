import authGuard from '@/services/auth-guard'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HubView from '../views/HubView.vue'

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
    component: HubView,
    beforeEnter: [authGuard],
    children: [
      {
        path: '',
        name: 'photos',
        component: () =>
          import(
            /* webpackChunkName: "photos" */ '../views/Photos/PhotosView.vue'
          )
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () =>
          import(
            /* webpackChunkName: "favorites" */ '../views/Photos/FavoritesView.vue'
          )
      },
      {
        path: 'recents',
        name: 'recents',
        component: () =>
          import(
            /* webpackChunkName: "recents" */ '../views/Photos/RecentsView.vue'
          )
      },
      {
        path: 'places',
        name: 'places',
        component: () =>
          import(
            /* webpackChunkName: "places" */ '../views/Photos/PlacesView.vue'
          )
      },
      {
        path: 'deleted',
        name: 'deleted',
        component: () =>
          import(
            /* webpackChunkName: "deleted" */ '../views/Photos/DeletedView.vue'
          )
      }
    ]
  },
  {
    path: '/albums',
    beforeEnter: [authGuard],
    component: HubView,
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
