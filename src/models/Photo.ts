import _default, { Fields, Model } from '@vuex-orm/core'
import axios from 'axios'

export default class Photo extends Model {
  static entity = 'photos'

  id!: string
  user_id!: string
  path!: string
  created_at!: string
  updated_at!: string
  image_base64!: string

  static fields(): Fields {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      path: this.attr(''),
      created_at: this.attr(''),
      updated_at: this.attr(''),

      image_base64: this.attr(null)
    }
  }

  static index() {
    return this.api().get(process.env.VUE_APP_BASE_URL + '/api/photos')
  }

  // lazy load image
  get image() {
    if (this.image_base64) {
      return this.image_base64
    }
    this.image_base64 = 'https://via.placeholder.com/150'
    this.$save()

    axios
      .get(this.path, {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        let image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )
        this.image_base64 = `data:image;base64,${image}`
        this.$save()
      })

    return this.image_base64
  }
}
