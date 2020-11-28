export default {
  win: {
    // Maybe useful, not now.
    chocoInstall: 'Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://chocolatey.org/install.ps1\'))',
    nodeInstall: 'choco install --yes nodejs-lts',
    yarnInstall: 'choco install --yes  yarn',
    gitInstall: 'choco install --yes  git',
    hexoInstallNpm: 'npm install hexo-cli -g --registry=https://registry.npm.taobao.org',
    hexoInstallYarn: 'yarn global add hexo-cli --registry https://registry.npm.taobao.org',
    markTextInstall: 'choco install --yes  marktext',
    openWithEditor: '{{filePath}}'
  },
  darwin: {
    homebrewInstall: '',
    nodeInstall: '',
    yarnInstall: '',
    gitInstall: '',
    hexoInstallNpm: 'npm install hexo-cli -g --registry=https://registry.npm.taobao.org',
    hexoInstallYarn: 'yarn global add hexo-cli --registry https://registry.npm.taobao.org',
    markTextInstall: '',
    openWithEditor: 'open {{filePath}}'
  }
}
