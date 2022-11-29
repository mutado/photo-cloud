import { Model } from '@vuex-orm/core'

export default class User extends Model {
  static entity = 'users'

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(''),
      email: this.attr(''),
      password: this.attr(''),
      token: this.attr('')
    }
  }

  static isAuthenticated() {
    let user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.token) {
      User.insert({ data: user.user })
    }
    return user.token !== undefined
  }

  static logout() {
    localStorage.removeItem('user')
  }

  static login(email: String, password: String): Promise<any> {
    return this.api()
      .post(process.env.VUE_APP_BASE_URL + '/api/login', {
        email: email,
        password: password
      })
      .then((response) => {
        if (response.response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.response.data))
        }

        return response.response.data
      })
  }
}
