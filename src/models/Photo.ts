import api from '@/api'
import _default, { Fields, Model } from '@vuex-orm/core'
import axios from 'axios'
import FolderPhoto from './FolderPhoto'

export default class Photo extends Model {
  static entity = 'photos'

  id!: string
  user_id!: string
  path!: string
  width!: number
  height!: number
  created_at!: string
  updated_at!: string

  thumbnail_loaded!: boolean
  thumbnail_loading!: boolean
  thumbnail_base64!: string | undefined

  image_loaded!: boolean
  image_loading!: boolean
  image_base64!: string | undefined

  static state() {
    return {
      zoom: 6,
      page: 1,
      photo: 0,
      center_image: true,
      sidebar: false,
      selected: [],
      count: 0,
      disk_used_percent: 0,
      disk_used: 0,
      disk_total: 0,
      scrollTop: 0
    }
  }

  static fields(): Fields {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      path: this.attr(''),
      width: this.attr(0),
      height: this.attr(0),
      created_at: this.attr(''),
      updated_at: this.attr(''),

      thumbnail_loaded: this.attr(false),
      thumbnail_loading: this.attr(false),
      thumbnail_base64: this.attr(null),

      image_loaded: this.attr(false),
      image_loading: this.attr(false),
      image_base64: this.attr(null)
    }
  }

  static afterDelete(model: any) {
    FolderPhoto.query()
      .where('photo_id', model.id)
      .get()
      .forEach((ph: FolderPhoto) => {
        ph.$delete()
      })
  }

  static index(page: number) {
    return this.api()
      .get(process.env.VUE_APP_BASE_URL + '/api/photos', {
        params: {
          page: page
        }
      })
      .then((response) => {
        console.log('photos: ' + response.response.data.length)
        Photo.commit((state) => {
          state.page += 1
          console.log('page: ' + state.page)
        })
        return response
      })
  }

  static show(id: string) {
    return this.api().get(process.env.VUE_APP_BASE_URL + '/api/photos/' + id)
  }

  static stats() {
    return this.api()
      .get(process.env.VUE_APP_BASE_URL + '/api/statistics/summary', {
        save: false
      })
      .then((response) => {
        Photo.commit((state) => {
          state.count = response.response.data.photos
          state.disk_used_percent =
            response.response.data.disk_usage.used_percent
          state.disk_used = response.response.data.disk_usage.used_size
          state.disk_total = response.response.data.disk_usage.total_size
        })
        return response
      })
  }

  static upload(file: File) {
    const formData = new FormData()
    formData.append('photo', file)
    const headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json'
    }
    return this.api()
      .post(process.env.VUE_APP_BASE_URL + '/api/photos', formData, { headers })
      .then((response) => {
        Photo.commit((state) => {
          state.count += 1
        })
        return response
      })
  }

  static destroy(id: string) {
    return this.api()
      .delete(process.env.VUE_APP_BASE_URL + '/api/photos/' + id, {
        delete: id
      })
      .then((response) => {
        Photo.commit((state) => {
          state.count -= 1
        })
        return response
      })
  }

  // lazy load image
  get image() {
    if (this.image_loading || this.image_loaded) {
      return this.image_base64
    }
    console.log('loading image')
    this.image_loading = true
    this.$save()

    api
      .get(this.path, {
        params: {
          format: 'data-url'
        }
      })
      .then((response) => {
        this.image_base64 = response.data
        this.image_loaded = true
        this.image_loading = false
        console.log('full size image loaded')
        this.$save()
      })
    return this.image_base64
  }

  get thumbnail() {
    if (this.thumbnail_loading || this.thumbnail_loaded) {
      return this.thumbnail_base64
    }
    console.log('loading image')
    this.thumbnail_loading = true
    this.$save()

    api
      .get(this.path, {
        params: {
          format: 'data-url',
          resolution: 'low',
          quality: 25
        }
      })
      .then((response) => {
        this.thumbnail_base64 = response.data
        this.thumbnail_loaded = true
        this.thumbnail_loading = false
        this.$save()
      })
    return this.thumbnail_base64
  }
}
