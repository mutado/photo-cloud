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
    beforeMount: (el, binding, node) => {
      ;(node as any).context = binding.instance
      ObserveVisibility.bind(el, binding, node)
    },
    updated: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind
  })
  .directive('selectable', {
    mounted(el, binding, node) {
      const addToSelection = (
        selection: string[],
        items: string[],
        removeOnOverlap = true
      ) => {
        let selected = selection
        items.forEach((item) => {
          if (selected.includes(item)) {
            if (removeOnOverlap) selected = selected.filter((s) => s !== item)
          } else selected.push(item)
        })
        return selected
      }

      el.addEventListener('mousedown', (e: any) => {
        if (e.button !== 0) return

        let selected = binding.value.getSelection() as string[]
        if (e.metaKey || e.ctrlKey) {
          // toggle selection if already selected or add to selection
          binding.value.setSelection(
            addToSelection(selected, [binding.arg as string])
          )
        } else if (e.shiftKey) {
          e.preventDefault()
          // select range
          const all = binding.value.getItems() as string[]
          const start = all.indexOf(selected[selected.length - 1])
          const end = all.indexOf(binding.arg as string)
          const range = all.slice(
            Math.min(start, end),
            Math.max(start, end) + 1
          )
          binding.value.setSelection(addToSelection(selected, range, false))
        } else {
          // select single item
          if (selected.length === 1 && selected[0] === binding.arg)
            binding.value.setSelection([])
          else binding.value.setSelection([binding.arg])
        }
      })
    },
    unmounted(el) {
      el.removeEventListener('mousedown', () => {})
    }
  })
  .mount('#app')
