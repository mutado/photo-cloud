import { App, Plugin } from 'vue'
import { getModalContainer } from './helpers'
import { ModalInterface } from './interface'
import { useModal } from './ts/api'

/**
 * The Modal plugin
 */
const Modal: Plugin = {
  install: (app: App, options = {}) => {
    console.log('===')

    let modal: ModalInterface = useModal(options)
    app.config.globalProperties.$modal = modal
    getModalContainer()
    app.provide('$modal', modal)
    console.log('Modal plugin installed')
    console.log(options)
    console.log('===')
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: ModalInterface
  }
}

export {}

export default Modal
