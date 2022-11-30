import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import database from '@/database'
import axios from 'axios'

VuexORM.use(VuexORMAxios, { axios })

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
  plugins: [VuexORM.install(database)]
})
