import store from '../store/index'
const axios = require('axios')
const clientId = '169cdcd0d09390360bbb'
const clientSecret = '23e0b24943cba7964e11271143521604e074c0cb'
export default {
  /**
   * Get github access_token with code
   * @param {string} code Code from website
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAccessToken (code) {
    return axios.post(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
      headers: {
        'Accept': 'application/json'
      }
    })
  },
  getUser (token) {
    return axios.get(`https://api.github.com/user`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `token ${token}`
      }
    })
  },
  getListRepo (name = store.getters.user) {
    return axios.get(`https://api.github.com/users/${name}/repos`)
  },
  createGithubPagesRepo (name = store.getters.user) {
    return axios.post(`https://api.github.com/user/repos`, {name: `${name}.github.io`}, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${store.state.settings.github.token}`
      }
    })
  }
}
