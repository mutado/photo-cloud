import { Database } from '@vuex-orm/core'
import User from '@/models/User'
import Photo from '@/models/Photo'

const database = new Database()

database.register(User)
database.register(Photo)

export default database
