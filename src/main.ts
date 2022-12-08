import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'normalize.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { ObserveVisibility } from 'vue-observe-visibility'

createApp(App)
  .use(store)
  .use(router)
  .directive('observe-visibility', {
    beforeMount: (el, binding, vnode) => {
      ;(vnode as any).context = binding.instance
      ObserveVisibility.bind(el, binding, vnode)
    },
    updated: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind
  })
  .mount('#app')
