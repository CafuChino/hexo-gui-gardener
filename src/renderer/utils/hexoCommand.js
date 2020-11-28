import tools from './tools'
import {read, write} from 'node-yaml'
import store from '../store/index'
// import system from './system'
const path = require('path')
const decompress = require('decompress')
const fs = require('fs')
const childProcess = require('child_process')
const download = require('download')
const log = require('electron-log')
const gm = require('gray-matter')
const filenamify = require('filenamify')
const moment = require('moment')
const GIT_STARTER_URL = 'https://gardener.oss-cn-beijing.aliyuncs.com/realease/starter-pack-latest.zip'
function _checkHexoDeleteDir ({create = true, hexoDir = store.getters.hexoDir}) {
  try {
    fs.readdirSync(path.join(hexoDir, 'deleted'))
    return true
  } catch (e) {
    if (e.code === 'ENOENT') {
      if (create) {
        fs.mkdirSync(path.join(hexoDir, 'deleted'))
        return true
      } else {
        return false
      }
    }
    return false
  }
}

/**
 * Check everything about hexoDir
 * @param {boolean} create Create dir when dir not exists
 * @param {string} hexoDir Path to hexo project
 * @returns {{msg: string, code: *, missingFile: boolean, hasDir: boolean, status: boolean, empty: boolean}|{msg: string, code: null, missingFile: boolean, hasDir: boolean, status: boolean, empty: boolean}|{msg: string, code: null, missingFile: string, hasDir: boolean, gitRepo: boolean, status: boolean, empty: boolean}|{msg: string, code: string, missingFile: boolean, hasDir: boolean, status: boolean, empty: boolean}|{msg: null, code: null, missingFile: boolean, hasDir: boolean, gitRepo: boolean, status: boolean, empty: boolean}}
 */
function checkHexoDir ({create = false, hexoDir = store.getters.hexoDir}) {
  const feature = [
    '_config.butterfly.yml',
    '_config.yml',
    'node_modules',
    'package.json',
    'scaffolds',
    'source',
    'themes'
  ]
  try {
    const fileList = fs.readdirSync(hexoDir)
    let gitRepo = fileList.indexOf('.git') !== -1
    for (const file of feature) {
      if (fileList.indexOf(file) === -1) {
        return {status: false, code: null, msg: `非项目文件夹或项目损坏：缺少${file}`, hasDir: true, missingFile: file, empty: false, gitRepo}
      }
    }
    return {status: true, code: null, msg: null, hasDir: true, missingFile: false, empty: false, gitRepo}
  } catch (e) {
    switch (e.code) {
      case 'ENOTDIR':
        return {status: false, code: 'ENOTDIR', msg: '请选择文件夹，该路径为一个文件', empty: false, missingFile: false, hasDir: false}
      case 'ENOENT':
        if (create) {
          try {
            fs.mkdirSync(hexoDir)
            return {status: false, code: null, msg: '文件夹为空', empty: true, missingFile: true, hasDir: true}
          } catch (e) {
            if (e.code === 'EPERM' || e.code === 'EACCES') {
              return {status: false, code: e.code, msg: '创建文件夹时权限不足或系统不允许创建', empty: false, missingFile: false, hasDir: false}
            }
          }
        }
        return {status: false, code: 'ENOENT', msg: '文件夹不存在', empty: false, missingFile: false, hasDir: false}
    }
  }
}
export default {
  /**
   * Init hexo project.
   * @param path
   * @returns {Promise<boolean|*>}
   */
  async hexoInit (path = store.getters.hexoDir) {
    await download(GIT_STARTER_URL, path)
    try {
      await decompress(path + '/starter-pack-latest.zip', path)
      return childProcess.execSync(store.getters.useYarn ? 'yarn' : 'npm i', {cwd: path})
    } catch (e) {
      return e
    }
  },
  /**
   * Clean db.json and public folder
   * @param {String} hexoDir Path to blog
   * @returns {void}
   */
  hexoClean (hexoDir = store.getters.hexoDir) {
    try {
      fs.rmdirSync(path.join(hexoDir, 'public'))
    } catch (e) {
      log.error(e)
    }
    try {
      fs.unlinkSync(path.join(hexoDir, 'db.json'))
    } catch (e) {
      log.error(e)
    }
  },
  /**
   * Generate static pages, also use to refresh hexo db.
   * @param {String} hexoDir Path to blog
   * @param {Boolean} clean Clean db.json and public folder before generate
   * @param {function} onOut Callback on stdout
   * @param {function} onError Callback on stderr
   * @param {function} onExit Callback on process exit
   */
  hexoGenerate ({hexoDir = store.getters.hexoDir, clean = true, onOut, onError, onExit}) {
    if (clean) {
      this.hexoClean(hexoDir)
    }
    const {stderr, stdout} = childProcess.spawn(process.platform === 'win32' ? 'hexo.cmd' : 'hexo', ['g'], {
      cwd: hexoDir
    })
    stdout.on('data', (data) => {
      onOut(tools.uint8ArrayToString(data))
    })
    stderr.on('data', (err) => {
      onError(tools.uint8ArrayToString(err))
    })
    stdout.on('close', (code) => {
      onExit(code)
    })
  },
  /**
   * Generate new post
   * @param {string} hexoDir Path to hexo dir
   * @param {string} title Title of the post
   * @param {string} content Content of the post
   * @param {Boolean} comments Allow comment or not
   * @param {string|string[]} tags Tag or array of tags
   * @param {string|string[]} categories Category or Category tree
   * @returns {string}
   */
  hexoNew ({hexoDir = store.getters.hexoDir, title, content, comments = true, tags, categories}) {
    const document = gm.stringify(content, {title, comments, tags, categories, date: moment().format('YYYY/MM/DD HH:MM:SS')})
    const filePath = path.join(hexoDir, 'source', '_posts', `${filenamify(title)}.md`)
    fs.writeFileSync(filePath, document)
    return filePath
  },
  hexoDelete (filePath) {
    const deleteDir = _checkHexoDeleteDir({create: true})
    if (deleteDir) {
      const fileName = path.parse(filePath).base
      fs.copyFileSync(filePath, path.join(store.getters.hexoDir, 'deleted', `${new Date().getTime()}${fileName}`))
      fs.unlinkSync(filePath)
      return true
    } else {
      return false
    }
  },

  /**
   * Get hexo db file.
   * @param hexoDir
   * @returns {Promise<unknown>}
   */
  getHexoDb (hexoDir = store.getters.hexoDir) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(hexoDir, 'db.json'), (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data.toString('utf-8'))
      })
    })
  },
  getHexoConfig (hexoDir = store.getters.hexoDir) {
    return read(path.join(hexoDir, '_config.yml'))
  },
  writeHexoConfig (obj, hexoDir = store.getters.hexoDir) {
    return write(path.join(hexoDir, '_config.yml'), obj)
  },
  getThemeConfig (hexoDir = store.getters.hexoDir) {
    return read(path.join(hexoDir, '_config.butterfly.yml'))
  },
  writeThemeConfig (obj, hexoDir = store.getters.hexoDir) {
    return write(path.join(hexoDir, '_config.butterfly.yml'), obj)
  },
  checkHexoDir
}
