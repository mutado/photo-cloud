import { Component } from 'vue'
import { buildInterface, ModalInterface } from '../interface'
import { ModalOptions } from '../types'

export const useModal = (globalOptions: ModalOptions) => {
  return buildInterface(globalOptions)
}
