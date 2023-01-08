import { App, Plugin } from 'vue'

declare interface Command {
  keys: string[]
  callback: (($event: CustomEvent) => void) | Function
  el: HTMLElement
}

class CustomEvent extends Event {
  constructor(typeArg: string, eventInitDict?: CustomEventInit) {
    super(typeArg, eventInitDict)
  }
}

// List of registered commands
let commands: Command[] = []

// List of keys that are currently pressed
let keys: string[] = []

let listenersInitialized = false

// usage:
// <div v-hot.keys="function"></div>
// <div v-hot.ctrl.enter="doSomething"></div>
const Hotkeys: Plugin = {
  install: (app: App, options = {}) => {
    console.log('Hotkeys plugin installed')
    app.directive('hot', {
      mounted(el, binding) {
        console.log('hot directive mounted')
        console.log(binding.value, typeof binding.value)

        commands.push({
          keys: Object.keys(binding.modifiers),
          callback: binding.value,
          el
        })

        console.log(commands)
      },
      unmounted(el, binding) {
        console.log('hot directive unmounted')
        commands = commands.filter((command) => command.el !== el)
      }
    })

    if (!listenersInitialized) {
      document.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          console.log('keydown', e.key)

          // add key to keys array
          const key = getKey(e)
          if (!keys.includes(key)) keys.push(key)

          // check if any commands match
          commands.forEach((command) => {
            // check if all keys in command is exactly the same as keys array
            if (command.keys.length === keys.length) {
              let match = true

              command.keys.forEach((key) => {
                if (!keys.includes(key)) match = false
              })

              if (match) {
                // execute callback
                //   command.callback(
                //     new CustomEvent('hotkeys', { detail: command.keys })
                //   )
                command.callback(null as any)
              }
            }
          })
        },
        true
      )

      document.addEventListener(
        'keyup',
        (e: KeyboardEvent) => {
          // remove key from keys array
          const key = getKey(e)
          keys = keys.filter((k) => k !== key)

          if (e.key === 'Meta') {
            // clear keys array if meta key is released
            if (e.code === 'MetaLeft' || e.code === 'MetaRight') keys = []
          }
        },
        true
      )
    }

    listenersInitialized = true
  }
}

const getKey = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Control':
      return 'ctrl'
    case 'Shift':
      return 'shift'
    case 'Alt':
      return 'alt'
    case 'Meta':
      return 'meta'
    case 'ArrowUp':
      return 'up'
    case 'ArrowDown':
      return 'down'
    case 'ArrowLeft':
      return 'left'
    case 'ArrowRight':
      return 'right'
    case ' ':
      return 'space'
    case 'Escape':
      return 'esc'
    case 'Delete':
      return 'del'
    default:
      return e.key.toLowerCase()
  }
}

export default Hotkeys
