import {machineIdSync} from 'node-machine-id'
import store from '../store/index'
import script from './scripts'
import tools from './tools'
const childProcess = require('child_process')
const log = require('electron-log')
// const _ = require('lodash')
const os = require('os')
const fs = require('fs')
// const path = require('path')
/**
 * Check if any dependency is installed
 * @param {String} env Dependency need to be checked
 * @returns {Promise<String>}
 */
function envCheck (env) {
  return new Promise((resolve, reject) => {
    const checkProcess = childProcess.exec(`${env} --version`, (error, stdout, stderr) => {
      if (error) {
        // Check Env Error
        log.error(error)
        reject(error)
      }
      if (stderr) {
        // Maybe  not installed
        log.warn(stderr)
        reject(stderr)
      }
      if (stdout) {
        log.info(`${env} Env check got ${stdout}`)
        resolve(stdout)
      }
      checkProcess.on('exit', (code) => {
        log.debug(`${env} environment check finished with code ${code}.`)
      })
    })
  })
}

function marktextCheckOnMac () {
  return new Promise((resolve, reject) => {
    const checkProcess = childProcess.exec(`ls /Applications`, (error, stdout, stderr) => {
      if (error) {
        // Check Env Error
        log.error(error)
        reject(error)
      }
      if (stderr) {
        log.warn(stderr)
        reject(stderr)
      }
      if (stdout) {
        log.info(`Marktext check got ${stdout}`)
        resolve(stdout)
      }
      checkProcess.on('exit', (code) => {
        log.debug(`Marktext check finished with code ${code}.`)
      })
    })
  })
}

function openWithEditor (filePath, os = store.state.env.os.os) {
  return new Promise((resolve, reject) => {
    const actScript = script[os].openWithEditor.replace('{{filePath}}', filePath)
    const openProcess = childProcess.exec(actScript, (error, stdout, stderr) => {
      if (error) {
        // Check Env Error
        log.error(error)
        reject(error)
      }
      if (stderr) {
        log.warn(stderr)
        reject(stderr)
      }
      if (stdout) {
        log.info(`Open file got ${stdout}`)
        resolve(stdout)
      }
      openProcess.on('exit', (code) => {
        resolve(code)
        log.debug(`Open file finished with code ${code}.`)
      })
    })
  })
}

/**
 * Save content to file.
 * @param {String} content Article markdown content
 * @param {String} filePath Path to file
 * @returns {Promise<String|Error>}
 */
function saveToFile (content, filePath) {
  return new Promise((resolve, reject) => {
    fs.appendFile(tools.pathUserHomeParse(filePath), content, 'utf8', err => {
      if (err) {
        reject(err)
      }
      resolve(filePath)
    })
  })
}
/**
 * Get Os details
 */
function getOsDetails () {
  return {
    os: os.platform(),
    arch: os.arch(),
    release: os.release()
  }
}

/**
 * Get machineId.
 * @returns {string}
 */
function getMachineId () {
  return machineIdSync(true)
}
export default {
  install (Vue, options) {
    Vue.prototype.$envCheck = envCheck
    Vue.prototype.$osCheck = getOsDetails
    Vue.prototype.$machineIdCheck = getMachineId
    Vue.prototype.$marktextMacCheck = marktextCheckOnMac
    Vue.prototype.$open = openWithEditor
    Vue.prototype.$save = saveToFile
  },
  openWithEditor
}
