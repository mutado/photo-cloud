import { Component, h, render } from 'vue'
import ModalContainer from './components/ModalContainer.vue'
import { ModalOptions } from './types'

// Creates a component and renders it into a container
// component - The component to render
// options - The options to pass to the component
// Returns the proxy of the component
export function createComponent(
  component: Component,
  options: ModalOptions = {}
) {
  return getModalContainer().show(component, options)
}

export function getModalContainer() {
  console.log('getModalContainer')
  console.log((document as any).modalContainer)

  if (!(document as any).modalContainer) {
    // Convert the component to a VNode
    const vNode = h(ModalContainer)

    // Create a container for the VNode
    const container = document.createElement('div')
    container.id = 'modal-container'

    console.log(document.getElementById('app') === null)

    // Add the container to the document
    document.getElementById('app')?.appendChild(container)

    // Render the VNode into the container
    render(vNode, container)

    console.log(container)

    // Add the container to the document
    ;(document as any).modalContainer = vNode.component!.proxy
  }

  return (document as any).modalContainer
}

/**
 * This function removes an element from the DOM. It uses the `remove()` API if
 * available, otherwise it falls back to using the `removeChild()` API. This
 * function does not accept a selector, only an element.
 *
 * @param el - The element to remove
 */
export function removeElement(el: Element) {
  // remove() is a browser API and is the preferred way to remove an element
  if (typeof el.remove !== 'undefined') {
    el.remove()
  } else {
    // If el.remove() is not available, remove the element from the DOM using
    // the parentNode property
    el.parentNode?.removeChild(el)
  }
}
