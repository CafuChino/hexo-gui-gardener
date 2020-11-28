import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState} from 'vuex-electron'

import modules from './modules'
const path = require('path')
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    env: {
      machineId: '',
      os: {
        os: '',
        arch: '',
        release: ''
      },
      node: {
        status: false,
        version: ''
      },
      hexo: {
        status: false,
        version: ''
      },
      chocolatey: {
        status: false,
        version: ''
      },
      yarn: {
        status: false,
        version: ''
      },
      git: {
        status: false,
        version: ''
      },
      markText: {
        status: false,
        version: ''
      },
      others: {}
    },
    settings: {
      useYarn: true,
      markTextPath: '',
      hexo: {
        baseDir: '',
        basic: {},
        theme: {}
      },
      marktext: {
        baseDir: ''
      },
      packagePreferences: '',
      github: {
        token: '',
        user: {}
      }
    },
    draft: {
      title: '',
      content: '',
      tags: [],
      categories: []
    }
  },
  mutations: {
    SET_MACHINE_ID (state, payload) {
      state.env.machineId = payload
    },
    SET_NODE_ENV (state, payload) {
      state.env.node = {...payload}
    },
    SET_HEXO_ENV (state, payload) {
      state.env.hexo = {...payload}
    },
    SET_OTHERS_ENV (state, payload) {
      state.env.others = {...payload}
    },
    SET_OS_ENV (state, payload) {
      state.env.os = {...payload}
    },
    SET_GIT_ENV (state, payload) {
      state.env.git = {...payload}
    },
    SET_YARN_ENV (state, payload) {
      state.env.yarn = {...payload}
    },
    SET_CHOCO_ENV (state, payload) {
      state.env.chocolatey = {...payload}
    },
    SET_MARK_TEXT_ENV (state, payload) {
      state.env.markText = {...payload}
    },
    SET_GITHUB_TOKEN (state, payload) {
      state.settings.github.token = payload
    },
    SET_GITHUB_USER (state, payload) {
      state.settings.github.user = {...payload}
    },
    SET_HEXO_DIR (state, payload) {
      state.settings.hexo.baseDir = payload
    },
    SET_HEXO_CONFIG_BASIC (state, payload) {
      state.settings.hexo.basic = {...payload}
    },
    SET_HEXO_CONFIG_THEME (state, payload) {
      state.settings.hexo.theme = {...payload}
    },
    SET_MARKTEXT_PATH (state, payload) {
      state.settings.markTextPath = payload
    },
    SWITCH_USE_YARN (state) {
      state.settings.useYarn = !state.settings.useYarn
    },
    SET_DRAFT (state, payload) {
      state.draft = {...payload}
    },
    CLEAR_DRAFT (state) {
      state.draft.title = ''
      state.draft.content = ''
      state.draft.tags = []
      state.draft.categories = []
    }
  },
  getters: {
    baseEnv (state) {
      return state.env.git.status && state.env.node.status && state.env.hexo.status
    },
    user (state) {
      return state.settings.github.user.login
    },
    token (state) {
      return state.settings.github.token
    },
    hexoDir (state) {
      return state.settings.hexo.baseDir
    },
    hexoPostDir (state) {
      return path.join(state.settings.hexo.baseDir, 'source', '_posts')
    },
    useYarn (state) {
      return state.settings.useYarn
    },
    hasDraft (state) {
      return state.draft.title.length > 0 || state.draft.content.length > 0 || state.draft.categories.length > 0 || state.draft.tags.length > 0
    },
    defaultHexoDir () {
      const USER_HOME = process.env.HOME || process.env.USERPROFILE
      return path.join(USER_HOME, 'gardener')
    }
  },
  modules,
  plugins: [
    createPersistedState()
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
