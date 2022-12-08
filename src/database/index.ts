import { Database } from '@vuex-orm/core'
import User from '@/models/User'
import Photo from '@/models/Photo'
import Folder from '@/models/Folder'
import FolderPhoto from '@/models/FolderPhoto'

const database = new Database()

database.register(User)
database.register(Photo)
database.register(Folder)
database.register(FolderPhoto)

export default database
