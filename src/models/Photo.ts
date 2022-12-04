import api from '@/api'
import _default, { Fields, Model } from '@vuex-orm/core'
import axios from 'axios'

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
      zoom: 9,
      center_image: true,
      sidebar: false,
      selected: []
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

  static index() {
    return this.api().get(process.env.VUE_APP_BASE_URL + '/api/photos')
  }

  // lazy load image
  get image() {
    if (this.image_loading || this.image_loaded) {
      return this.image_base64
    }
    console.log('loading image')
    this.image_loading = true
    this.thumbnail_loading = true
    this.$save()

    api
      .get(this.path, {
        params: {
          format: 'base64'
        }
      })
      .then((response) => {
        this.image_base64 = `data:image;base64,${response.data}`
        this.thumbnail_base64 = this.image_base64
        this.image_loaded = true
        this.thumbnail_loaded = true
        this.image_loading = false
        this.thumbnail_loading = false
        this.$save()
      })
    return this.image_base64
  }

  get thumbnail() {
    return this.image
  }
}
