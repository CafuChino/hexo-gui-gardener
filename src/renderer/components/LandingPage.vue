<template>
  <div>
    <a-row :gutter="16">
      <a-col span="12">
        <a-card title="环境状态">
          <a-icon slot="extra" type="question-circle" style="cursor: pointer"/>
          <a-tooltip>
            <template slot="title">
              系统环境
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <a-spin :spinning="loading.choco" tip="检查更新">
                <span class="mini-icon"><img src="@/assets/icons/layout.png" alt=""></span>
                {{env.os.os}}
                <p class="environment-is-installed" :class="{installed:true}">
                  {{ env.os.release }}</p>
              </a-spin>
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              Hexo的依赖环境，用于为您生成页面（必须）
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center"
                         @click="installSoftware('node')">
              <span class="mini-icon"><img src="@/assets/icons/nodejs.png" alt=""></span>
              Nodejs
              <p class="environment-is-installed" :class="{installed: env.node.status}">
                {{ env.node.status ? `v${env.node.version}` : '未安装' }}</p>
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              更方便的Nodejs包管理器（可选）
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center"
                         @click="installSoftware('yarn')">
              <span class="mini-icon"><img src="@/assets/icons/yarn.png" alt=""></span>
              Yarn
              <p class="environment-is-installed" :class="{installed: env.yarn.status}">
                {{ env.yarn.status ? `v${env.yarn.version}` : '未安装' }}</p>
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              用于部署网站到Github Pages（必须）
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center"
                         @click="installSoftware('git')">
              <span class="mini-icon"><img src="@/assets/icons/git.png" alt=""></span>
              Git
              <p class="environment-is-installed" :class="{installed: env.git.status}">
                {{ env.git.status ? `v${env.git.version}` : '未安装' }}</p>
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              核心组件（必须）
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/hexo.png" alt=""></span>
              Hexo
              <p class="environment-is-installed" :class="{installed: env.hexo.status}">
                {{ env.hexo.status ? `v${env.hexo.version}` : '未安装' }}</p>
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              Markdown编辑器，在本软件外编辑文章（建议）
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/financial_markdown.png" alt=""></span>
              MarkText
              <p class="environment-is-installed" :class="{installed: env.markText.status}">
                {{ env.markText.status ? `已安装` : '安装或配置路径' }}</p>
            </a-card-grid>
          </a-tooltip>
        </a-card>
      </a-col>
      <a-col span="12">
        <a-card title="便捷操作">
          <a-icon slot="extra" type="question-circle" style="cursor: pointer"/>
          <a-tooltip>
            <template slot="title">
              新建一篇文章
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/Chocolate.png" alt=""></span>
              新文章
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              查看现有文章列表
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/nodejs.png" alt=""></span>
              文章列表
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              待开发
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/yarn.png" alt=""></span>
              文章广场
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              将网站源代码进行备份以防丢失
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/git.png" alt=""></span>
              一键备份
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              一键将网站部署到Github Pages
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/hexo.png" alt=""></span>
              一键部署
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              检查软件是否有新版本
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/financial_markdown.png" alt=""></span>
              检查更新
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              检查软件是否有新版本
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/financial_markdown.png" alt=""></span>
              检查更新
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              检查软件是否有新版本
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/financial_markdown.png" alt=""></span>
              检查更新
            </a-card-grid>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              检查软件是否有新版本
            </template>
            <a-card-grid class="environment-gird" :hoverable="false" style="width:33.33%;text-align:center">
              <span class="mini-icon"><img src="@/assets/icons/financial_markdown.png" alt=""></span>
              检查更新
            </a-card-grid>
          </a-tooltip>
        </a-card>
      </a-col>
    </a-row>
    <br>
    <a-row :gutter="16">
      <a-col span="12">
        <a-card title="命令窗">
          <a-textarea v-model="commandOut" placeholder="命令的执行状态" :rows="4"/>
        </a-card>
      </a-col>
      <a-col span="12"></a-col>
    </a-row>
    <a-modal
        v-model="initModal"
        title="第一次运行..."
        centered
    >
      <p>Hexo-园丁是一款基于Hexo开发的软件，它可以帮你配置所需要的软件环境、管理文章、自动备份、一键发布到网站......它的功能很强大，但他其实只是帮助你执行了一些命令而已，如果你是一个电脑小白的话你会爱上这种感觉的hhh......</p>
      <p>在软件的使用中，本软件会收集一些必要的信息，比如系统类型，版本，和一切其他软件运行所需的与您隐私无关的信息。我承诺不保存您的文章、账号、等等任何敏感信息，但如果你对此感觉不适可以随时卸载本软件。</p>
      <p>为你的文章们生成网站需要一系列的运行环境辅助，我们可以辅助你配置相关的运行环境：</p>
      <ol>
        <li><b>安装包安装：</b>你只需要按照顺序运行一系列的安装包，然后一直点确定即可。这个方法需要你进行一点点的操作，但几乎没有难度，也最稳定。<b>（推荐）</b></li>
        <li><b>自行安装：</b>如果你觉得你自己能搞定，或者已经安装完毕相关环境，请直接选择自行安装<b>（其实也没问题）</b></li>
      </ol>
      <template slot="footer">
        <a-button key="submit" type="primary" @click="openDownload">
          安装包安装
        </a-button>
        <a-button>
          自行安装
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import scripts from '@/utils/scripts'
import { app } from 'electron'
const log = require('electron-log')
const Powershell = require('powershell')
export default {
  name: 'landing-page',
  data () {
    return {
      initModal: false,
      commandOut: '',
      installing: false,
      loading: {
        choco: false
      }
    }
  },
  methods: {
    /**
     * Check if software has init.
     * @returns {Promise<unknown>}
     */
    initCheck () {
      return new Promise((resolve, reject) => {
        this.$db.findOne({key: 'machineId'}, (err, docs) => {
          if (err) {
            log.error(err)
            reject(err)
          }
          resolve(docs)
        })
      })
    },
    openDownload () {
      this.initModal = false
      this.$electron.shell.openExternal('https://baidu.com')
    },
    checkUpdate () {
      // TODO:Finish this
      console.log(app.getVersion())
    },
    installSoftware (software) {
      if (this.installing) {
        return this.$message.error('请等待其他安装完成')
      }
      if (this.$store.state.env[software].status) {
        return this.$message.success(`${software}已安装`)
      }
      if (this.$store.state.env.os.os === 'win32') {
        let ps = new Powershell(scripts.win[`${software}Install`], {debug: true}, () => {
        })
        this.loading.choco = true
        let error = false
        // Handle process errors (e.g. powershell not found)
        ps.on('error', err => {
          log.error(err)
          error = true
          this.commandOut += err
        })

        // Stdout
        ps.on('output', data => {
          log.info(data)
          this.commandOut += data
        })

        // Stderr
        ps.on('error-output', data => {
          log.error(data)
          error = true
          this.commandOut += data
        })

        // End
        ps.on('end', code => {
          log.debug(code)
          this.loading.choco = false
          this.commandOut += `${software} 安装完毕：${code}`
          if (error) {
            this.$warning({
              title: `${software}安装结束，但......`,
              content: '有一些错误发生，可能环境已成功安装，也可能没有......重启应用，收束世界线吧！',
              onOk: () => {
                this.installing = false
                this.$electron.ipcRenderer.send('reload')
              }
            })
          } else {
            this.$success({
              title: `${software}安装成功`,
              content: '请点击确定重启应用',
              onOk: () => {
                this.installing = false
                this.$electron.ipcRenderer.send('reload')
              }
            })
          }
          // Do Something on end
        })
      }
    }
  },
  computed: {
    ...mapState({
      env: 'env'
    })
  },
  async mounted () {
    const init = await this.initCheck()
    if (init) {
      this.initModal = false
      this.$store.commit('SET_MACHINE_ID', init.value)
    } else {
      this.initModal = true
      const machineId = await this.$machineIdCheck()
      this.$db.update({key: 'machineId'}, {key: 'machineId', value: machineId}, {upsert: true}, (err) => { log.error(err) })
      this.$store.commit('SET_MACHINE_ID', machineId)
    }
  }
}
</script>

<style scoped lang="less">
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.shadow-not-installed {
  box-shadow: inset 0 0 20px #f5222d, 0 0 2px #f5222d;
}

.shadow-installed {
  box-shadow: inset 0 0 20px #52c41a, 0 0 2px #52c41a;
}

.mini-icon img {
  height: 1.3em;
}

.environment-gird {
  position: relative;
  padding: 18px;
}

.environment-is-installed {
  font-size: 0.9em;
  margin: 10px 0 0 0;
  color: #f5222d;
  cursor: pointer;
}

.installed {
  color: #6a6a6a;
  cursor: default;
}
</style>
