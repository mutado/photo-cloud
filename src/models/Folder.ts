import { Model } from '@vuex-orm/core'
import FolderPhoto from './FolderPhoto'
import Photo from './Photo'

export default class Folder extends Model {
  static entity = 'folders'

  static state() {
    return {
      selected: [],
      count: 0,
      count_shared: 0
    }
  }

  id!: string
  user_id!: string
  name!: string
  photos_count!: number
  created_at!: string
  updated_at!: string

  photo_references: FolderPhoto[] = []
  photos: Photo[] = []

  static fields() {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      name: this.attr(''),
      photos_count: this.attr(0),
      created_at: this.attr(''),
      updated_at: this.attr(''),

      photo_references: this.hasMany(FolderPhoto, 'folder_id'),
      photos: this.hasManyThrough(Photo, FolderPhoto, 'folder_id', 'photo_id')
    }
  }

  static index() {
    return this.api().get(process.env.VUE_APP_BASE_URL + '/api/folders')
  }

  static show(folder_id: string) {
    return this.api().get(
      process.env.VUE_APP_BASE_URL + '/api/folders/' + folder_id
    )
  }

  static put(folder_id: string, data: any) {
    return this.api().put(
      process.env.VUE_APP_BASE_URL + '/api/folders/' + folder_id,
      data
    )
  }

  static post(data: any) {
    return this.api().post(process.env.VUE_APP_BASE_URL + '/api/folders', data)
  }
}
