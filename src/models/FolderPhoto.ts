import { Model } from '@vuex-orm/core'
import Photo from './Photo'

export default class FolderPhoto extends Model {
  static entity = 'photo_references'

  id!: string
  folder_id!: string
  photo_id!: string

  photo!: Photo

  static fields() {
    return {
      id: this.attr(null),
      folder_id: this.attr(null),
      photo_id: this.attr(null),

      photo: this.belongsTo(Photo, 'photo_id')
    }
  }

  static index() {
    return this.api().get(process.env.VUE_APP_BASE_URL + '/api/folder_photos')
  }
}
