import { Component } from 'vue'
import { createComponent } from './helpers'
import { ModalOptions } from './types'

export interface ModalInterface {
  show: (component: Component, options: ModalOptions) => Promise<any>
}

export const buildInterface = (globalOptions: ModalOptions): ModalInterface => {
  return {
    show(component: Component, options: ModalOptions): Promise<any> {
      // Create the component and mount it into the DOM
      return createComponent(component, {
        ...globalOptions,
        ...options
      } as ModalOptions)
    }
  }
}
