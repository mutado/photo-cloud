import { Component, ShallowRef } from 'vue'

export declare interface ModalOptions {
  title?: string
  props?: any
  width?: number | string
  height?: number | string
  fullscreen?: boolean
  dismissable?: boolean
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
}

export class ModalData implements ModalOptions {
  title?: string
  props?: any
  width?: number | string
  height?: number | string
  fullscreen?: boolean
  dismissable: boolean = true
  private _closeOnBackdrop: boolean = true
  closeOnEsc: boolean = true

  public get closeOnBackdrop(): boolean {
    return this._closeOnBackdrop
  }
  public set closeOnBackdrop(value: boolean) {
    this._closeOnBackdrop = value
  }

  constructor(options: ModalOptions) {
    Object.assign(this, options)
  }

  get widthStyle(): string {
    if (this.fullscreen) return '100%'
    if (this.width === undefined) return 'auto'
    return typeof this.width === 'number' ? `${this.width}px` : this.width
  }

  get heightStyle(): string {
    if (this.fullscreen) return '100%'
    if (this.height === undefined) return 'auto'
    return typeof this.height === 'number' ? `${this.height}px` : this.height
  }
}

export declare interface ModalComponent {
  id: string
  component: Component
  options: ModalData

  destroy: () => void
  close?: (data: any) => void
  dismiss?: (data: any) => void
}
