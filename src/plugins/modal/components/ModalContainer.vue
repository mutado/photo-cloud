<template>
  <div class="modal-overlay" v-if="modals.length">
    <div
      class="modal"
      v-for="modal in modals"
      :style="getStyle(modal.value.options)"
    >
      <component
        :is="modal.value.component"
        @close="modal.value.close"
        @dismiss="modal.value.dismiss"
        v-bind="modal.value.options.props"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, defineComponent, ShallowRef, shallowRef } from 'vue'
import { ModalOptions, ModalComponent, ModalData } from '../types'

export default defineComponent({
  name: 'ModalContainer',
  data() {
    return {
      modals: [] as ShallowRef<ModalComponent>[]
    }
  },
  methods: {
    getStyle(options: ModalOptions) {
      return {
        width: options.fullscreen ? '100%' : this.getDimensions(options.width),
        height: options.fullscreen
          ? '100%'
          : this.getDimensions(options.height),
        padding: options.fullscreen ? '0' : '20px',
        borderRadius: options.fullscreen ? '0' : '5px',
        border: options.fullscreen ? '0' : ''
      }
    },
    getDimensions(dimension?: string | number) {
      return dimension
        ? typeof dimension === 'string'
          ? dimension
          : dimension + 'px'
        : 'auto'
    },
    show(component: Component, props: ModalOptions) {
      let modalComponent: ModalComponent = {
        id: Math.random().toString(36).substr(0, 36),
        component,
        options: new ModalData(props),

        destroy: () => {
          this.modals = this.modals.filter(
            (modal) => modal.value.id !== modalComponent.id
          )
        }
      }

      const promise = new Promise((resolve) => {
        modalComponent.close = (data: any) => {
          modalComponent.destroy()
          resolve(data)
        }

        modalComponent.dismiss = () => {
          modalComponent.destroy()
          resolve(null)
        }
      })

      this.modals.push(shallowRef(modalComponent))

      return promise
    }
  }
})
</script>
<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal {
  position: absolute;
  background-color: rgba(21, 21, 21, 0.99);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 20px;
}
</style>
