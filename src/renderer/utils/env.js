import scripts from '@/utils/scripts'
import store from '@/store/index'
const childProcess = require('child_process')
function installHexo (os = store.state.env.os.os) {
  try {
    return childProcess.execSync(store.getters.useYarn ? scripts[os].hexoInstallYarn : scripts[os].hexoInstallNpm)
  } catch (e) {
    return e
  }
}

export default {
  installHexo
}
