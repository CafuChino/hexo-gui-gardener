<template>
  <div style="background: white;padding:18px">
    <a-row type="flex" justify="start" align="middle" class="setting-item">
      <a-col span="5"><span class="item-title">Github:</span></a-col>
      <a-col span="10">
        <span v-if="$store.state.settings.github.token">{{ $store.state.settings.github.user.login }} <a-button
            style="margin-left: 28px" @click="jumpGithubLogin">切换账号</a-button></span>
        <a-button v-else type="primary" @click="jumpGithubLogin">登 录</a-button>
      </a-col>
    </a-row>
    <a-row type="flex" justify="start" align="middle" class="setting-item">
      <a-col span="5"><span class="item-title">博客文件路径：</span></a-col>
      <a-col span="10">
        <span>{{ $store.state.settings.hexo.baseDir ? $store.state.settings.hexo.baseDir : '未设置' }}</span>
        <a-button style="margin-left: 28px" @click="setHexoDir">设 置</a-button>
      </a-col>
    </a-row>
    <a-row type="flex" justify="start" align="middle" class="setting-item">
      <a-col span="5"><span class="item-title">使用yarn：</span></a-col>
      <a-col span="10">
        <a-switch :checked="useYarn" @change="yarnChange"/>
      </a-col>
    </a-row>
    <a-row type="flex" justify="start" align="middle" class="setting-item">
      <a-col span="5"><span class="item-title">MarkText{{$store.state.env.os.os === 'darwin'?'':'路径'}}：</span></a-col>
      <a-col v-if="$store.state.env.os.os !== 'darwin'" span="10">
        <span>{{ $store.state.settings.hexo.baseDir ? $store.state.settings.hexo.baseDir : '未设置' }}</span>
        <a-button style="margin-left: 28px" @click="setMarkTextDir">设 置</a-button>
      </a-col>
      <a-col v-else span="10">
        <span>{{ $store.state.env.markText.status ? '已安装' : '未安装' }}</span>
      </a-col>
    </a-row>
    <a-modal
        title="输入获得的code"
        :visible="githubCodeModal.visibility"
        :confirm-loading="githubCodeModal.loading"
        @ok="getAccessToken"
        @cancel="githubCodeModal.visibility=false"
    >
      <a-input v-model="githubCodeModal.code" placeholder="请输入获得的Code"></a-input>
    </a-modal>
    <a-modal v-model="hexoModal.visibility" title="初始化博客......" :maskClosable="false" :footer="false">
      <a-result :title="hexoModal.title" :status="hexoModal.status">
        <template v-if="hexoModal.status==='loading'" #icon>
          <a-icon type="loading"/>
        </template>
        <template #subTitle>
          {{ hexoModal.subTitle }}
        </template>
        <template #extra>
          <a-button v-if="hexoModal.status === 'loading'">取消</a-button>
          <a-button v-else type="primary" @click="hexoModal.visibility=false">完成</a-button>
        </template>
      </a-result>
    </a-modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import hexo from '@/utils/hexoCommand'
// const path = require('path')
import github from '@/utils/githubCommand'

const fs = require('fs')
const log = require('electron-log')
export default {
  name: 'Settings',
  data () {
    return {
      settings: {},
      githubCodeModal: {
        visibility: false,
        code: '',
        loading: false
      },
      hexoModal: {
        visibility: false,
        status: 'loading',
        title: '',
        subTitle: '这需要1 - 2分钟，受您的网络情况影响'
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user',
      token: 'token',
      hexoDir: 'hexoDir',
      useYarn: 'useYarn'
    })
  },
  methods: {
    jumpGithubLogin () {
      this.$electron.shell.openExternal('https://github.com/login/oauth/authorize?client_id=169cdcd0d09390360bbb&scope=repo&redirect_uri=http://api.cafuchino.com/app/mock/26/gardener')
      this.githubCodeModal.visibility = true
    },

    getAccessToken () {
      this.githubCodeModal.loading = true
      github.getAccessToken(this.githubCodeModal.code).then(res => {
        const token = res.data.access_token
        this.$store.commit('SET_GITHUB_TOKEN', token)
        github.getUser(token).then(res => {
          const user = res.data
          this.$store.commit('SET_GITHUB_USER', user)
          this.githubCodeModal.loading = false
          this.githubCodeModal.visibility = false
        })
      })
    },
    checkHexoDir (hexoDir) {
      return new Promise((resolve, reject) => {
        fs.readdir(hexoDir, (err, files) => {
          if (err) {
            log.error(err)
            reject(err)
          }
          // Hexo dir should contains.
          const feature = [
            'node_modules',
            'package.json',
            'scaffolds',
            'source',
            'themes',
            '_config.yml'
          ]
          // TODO: temp files on mac may cause problem
          if (files.length === 0) {
            // Empty dir.
            resolve({status: false, file: null})
          }
          for (const file of feature) {
            if (files.indexOf(file) === -1) {
              // Not a hexo dir.
              resolve({status: false, file: file})
            }
          }
          resolve({status: true})
        })
      })
    },
    setHexoDir () {
      const that = this
      this.$electron.ipcRenderer.send('open-file-dialog')
      this.$electron.ipcRenderer.on('selected-directory', async (event, path) => {
        const dirCheck = await that.checkHexoDir(path[0])
        if (!dirCheck.status) {
          if (!dirCheck.file) {
            return that.$confirm({
              title: '选择了空文件夹',
              content: '需要为您初始化吗？',
              onCancel: () => {
              },
              onOk: async () => {
                that.$destroyAll()
                if (!that.$store.getters.baseEnv) {
                  const h = that.$createElement
                  return that.$error({
                    title: '无法初始化',
                    content: h('div', {}, [
                      h('p', {}, '缺少依赖环境所以无法初始化。如需帮助，请查阅帮助文档')
                    ]),
                    okText: '前往帮助',
                    // TODO:Link to help page.
                    onOk: () => {
                      that.$electron.shell.openExternal('http://www.baidu.com')
                    }
                  })
                }
                that.hexoModal.visibility = true
                that.hexoModal.status = 'loading'
                that.hexoModal.title = '下载模板中...'
                const initBlog = await hexo.hexoInit(path[0]).catch(err => {
                  that.hexoModal.title = '下载模板失败，请截图反馈'
                  that.hexoModal.status = 'error'
                  that.hexoModal.subTitle = err
                  return false
                })
                console.log(initBlog)
                if (initBlog) {
                  that.hexoModal.title = '下载完成'
                  that.hexoModal.status = 'success'
                  that.hexoModal.subTitle = '现在你可以到文章 - 网站设置来打理你的网站了!'
                  that.$store.commit('SET_HEXO_DIR', path[0])
                }
              }
            })
          }
          return that.$error({
            title: '设置失败',
            content: `你选择的不是Hexo博客目录，或hexo目录不完整。原因是缺少${dirCheck.file}`
          })
        }
        that.$store.commit('SET_HEXO_DIR', path[0])
      })
    },
    setMarkTextDir () {
      this.$electron.ipcRenderer.send('open-file-dialog')
      this.$electron.ipcRenderer.on('selected-directory', (event, path) => {
        this.$store.commit('SET_MARKTEXT_PATH', path[0])
      })
    },
    yarnChange () {
      this.$store.commit('SWITCH_USE_YARN')
    }
  }
}
</script>

<style scoped>
.item-title {
  font-size: 1.2em;
  font-weight: bold;
}

.setting-item {
  margin: 30px 0;
}
</style>
