<template>
  <div class="main">
    <a-spin :spinning="spinning" :tip ='tip' size="large">
      <a-card style="min-height: 70vh">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <a-carousel v-show="current===0" class="env-carousel" ref="env">
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/nodejs-color.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>Node.js 是一个开源与跨平台的 JavaScript 运行时环境。 它是一个可用于几乎任何项目的流行工具！</p>
                <p>Gardener使用基于Node的Hexo框架生成你的网站———至于Hexo的事一会儿再说...</p>
                <p>你应该可以在我们为你提供的工具包中找到安装文件 <a>需要帮助？</a></p>
                <p style="color: #52c41a" v-if="this.$store.state.env.node.status">你已经成功地安装了Node v{{$store.state.env.node.version}}</p>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button v-if="!this.$store.state.env.node.status" type="primary" @click="checkEnv">我安装好了！</a-button>
                  <a-button v-if="this.$store.state.env.node.status"  @click="$refs.env.next()"><a-icon type="check-circle"/>下一步</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/gitHub.png" alt="" class="env-pic" style="margin: 9vh 0;">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。</p>
                <p>Github为我们提供免费的Github Pages，可以用来放置我们的网页。</p>
                <p>你应该可以在我们为你提供的工具包中找到安装文件 <a>需要帮助？</a></p>
                <p style="color: #52c41a" v-if="this.$store.state.env.node.status">你已经成功地安装了Git v{{$store.state.env.git.version}}</p>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button v-if="!this.$store.state.env.git.status" type="primary" @click="checkEnv">我安装好了！</a-button>
                  <a-button v-if="this.$store.state.env.git.status"  @click="$refs.env.next()"><a-icon type="check-circle"/>下一步</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/yarn.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>Yarn是一个Nodejs包管理器，它可以加快项目初始化速度，但不是必须的。</p>
                <p v-if="$store.state.env.os.os==='darwin'">检测到你可能使用了MacOS，安装起来可能略微有些困难，你可以 <a>查看帮助</a>或点击"我不需要Yarn"</p>
                <p v-else>你应该可以在我们为你提供的工具包中找到安装文件 <a>需要帮助？</a></p>
                <p style="color: #52c41a" v-if="this.$store.state.env.yarn.status">你已经成功地安装了Yarn v{{$store.state.env.yarn.version}}</p>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button v-if="!this.$store.state.env.yarn.status" type="primary"  @click="$refs.env.next()">我安装好了！</a-button>
                  <a-button  @click="()=>{if($store.getters.useYarn) $store.commit('SWITCH_USE_YARN');$refs.env.next()}"><a-icon type="check-circle"/>
                    {{ this.$store.state.env.yarn.status?'下一步':'我不需要Yarn' }}</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/hexo.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>Hexo 是一个快速、简洁且高效的博客框架。</p>
                <p>在这一步我们会替你安装，只要确保你之前正确地安装了Node和Yarn（如果选择安装）即可</p>
                <p>请点击"安装"然后稍等片刻</p>
                <p style="color: #52c41a" v-if="this.$store.state.env.hexo.status">你已经成功地安装了Hexo v{{$store.state.env.yarn.version}}</p>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button v-if="!this.$store.state.env.yarn.status" type="primary" :loading="loading.installHexo">安装</a-button>
                  <a-button v-else @click="current++"><a-icon type="check-circle"/>下一步</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
        </a-carousel>
        <a-carousel v-show="current===1" class="env-carousel" ref="hexo">
<!--          <div v-if="emptyFolder">-->
<!--            <a-card class="env-card">-->
<!--              <a-row  type="flex" justify="center">-->
<!--                <a-col>-->
<!--                  <img src="@/assets/icons/search.png" alt="" class="env-pic">-->
<!--                </a-col>-->
<!--              </a-row>-->
<!--              <div style="text-align: center">-->
<!--                <p>检测到了空文件夹</p>-->
<!--                <p>你是否在第一次初始化时以外关闭了软件？或者手动清空了文件夹？</p>-->
<!--                <p>你现在可以选择继续在此文件夹重新初始化，或者重新选择项目文件夹<a>需要帮助？</a></p>-->
<!--                <p style="color: #52c41a">你的项目文件夹为 {{$store.getters.hexoDir}}</p>-->
<!--              </div>-->
<!--              <a-row  type="flex" justify="center">-->
<!--                <a-col>-->
<!--                  <a-button  type="primary" @click="$refs.hexo.next()">重新初始化</a-button>-->
<!--                  <a-button @click="greenHand=true;$refs.hexo.next()"><a-icon type="check-circle"/>选择新文件夹</a-button>-->
<!--                </a-col>-->
<!--              </a-row>-->
<!--            </a-card>-->
<!--          </div>-->
          <div>
            <a-card class="env-card" @dragover="e=>{e.preventDefault()}" @drop="hexoDirDrag">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/Blog.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>创建你的Hexo项目</p>
                <p>你可以选择使用默认路径、或者在你喜欢的地方创建文件夹，然后拖入窗口</p>
                <p>注意！一旦你创建项目完毕，你就不能再修改项目的位置和文件夹名字了！ <a>需要帮助？</a></p>
                <p style="color: #52c41a" v-if="tempPath">你选择了 {{tempPath}}</p>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button v-if="this.tempPath" type="primary" @click="$refs.env.next()">在这创建我的网站</a-button>
                  <a-button v-else  @click="$store.commit('SET_HEXO_DIR', $store.getters.defaultHexoDir);$refs.hexo.next()"><a-icon type="check-circle"/>使用默认路径</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/cloud.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>初始化你的Hexo项目</p>
                <p>接下来程序将会自动下载模板到指定的文件夹</p>
                <p>确认无误后点击开始按钮</p>
                <p style="color: #52c41a">项目位置 {{tempPath || $store.getters.hexoDir}}</p>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button @click="initHexoProject" :loading="loading.installHexo"><a-icon type="check-circle"/>开始！</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/tea.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>配置你的网站</p>
                <p>给你的网站取个名字吧</p>
                <a-row  type="flex" justify="center">
                  <a-col span="12">
                    <a-input v-model="tempSettings.title" style="margin-bottom: 8px"></a-input>
                  </a-col>
                </a-row>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button @click="$refs.hexo.next()"><a-icon type="check-circle"/>确定</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/tea.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>配置你的网站</p>
                <p>你的名字？</p>
                <a-row  type="flex" justify="center">
                  <a-col span="12">
                    <a-input v-model="tempSettings.author" style="margin-bottom: 8px"></a-input>
                  </a-col>
                </a-row>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button @click="current++"><a-icon type="check-circle"/>确定</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
        </a-carousel>
        <a-carousel v-show="current===2" class="env-carousel" ref="github">
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/gitHub.png" alt="" class="env-pic" style="margin: 9vh 0;">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>接下来将自动为你进行Github仓库的初始化</p>
                <p>请点击按钮进行授权</p>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button @click="$refs.github.next()"><a-icon type="check-circle"/>授权</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/gitHub.png" alt="" class="env-pic" style="margin: 9vh 0;">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>请输入获得的授权Code</p>
                <a-row  type="flex" justify="center">
                  <a-col span="12">
                    <a-input v-model="tempSettings.code" style="margin-bottom: 8px"></a-input>
                  </a-col>
                </a-row>
              </div>
              <a-row  type="flex" justify="center">
                <a-col>
                  <a-button @click="$refs.github.next()"><a-icon type="check-circle"/>确定</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/printer.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>接下来我们将利用授权做以下检查和操作</p>
                <p>1.获取你的Github账号信息（名字、邮箱）</p>
                <p>2.检查并添加Github Pages仓库</p>
                <p>3.初始化Hexo项目并提交到GitHub</p>
              </div>
              <a-row type="flex" justify="center">
                <a-col>
                  <a-button @click="current++"><a-icon type="check-circle"/>确定</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
        </a-carousel>
        <a-carousel v-show="current===3" class="env-carousel" ref="deploy">
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/printer.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>接下来我们将尝试第一次部署网站</p>
                <p>如果一切顺利的话，很快你的网站就可以访问了</p>
              </div>
              <a-row type="flex" justify="center">
                <a-col>
                  <a-button @click="$refs.deploy.next()"><a-icon type="check-circle"/>确定</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/printer.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>准备就绪！</p>
                <p>现在你可以查看你的网站并开始发布文章了！</p>
              </div>
              <a-row type="flex" justify="center">
                <a-col>
                  <a-button @click="$refs.deploy.next()"><a-icon type="check-circle"/>确定</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
        </a-carousel>
        <a-carousel v-show="current===4" class="env-carousel" ref="treat">
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/red_packet.png" alt="" class="env-pic">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>软件的使用是免费的，但是陌谦真的花费了大量时间进行开发</p>
                <p>如果你愿意给予他一点微薄的收入，可以打开支付宝搜索699681774，领取红包</p>
                <p>注意！这个软件开源但保留著作权，禁止任何形式的商用！</p>
              </div>
              <a-row type="flex" justify="center">
                <a-col>
                  <a-button @click="$refs.treat.next()"><a-icon type="check-circle"/>现在就去！</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
          <div>
            <a-card class="env-card">
              <a-row  type="flex" justify="center">
                <a-col>
                  <img src="@/assets/icons/gitHub.png" alt="" class="env-pic" style="margin: 9vh 0">
                </a-col>
              </a-row>
              <div style="text-align: center">
                <p>陌谦很想要Star！</p>
                <p>你愿意给这个项目点一个Star吗QAQ</p>
              </div>
              <a-row type="flex" justify="center">
                <a-col>
                  <a-button @click="$refs.treat.next()"><a-icon type="check-circle"/>现在就去！</a-button>
                </a-col>
              </a-row>
            </a-card>
          </div>
        </a-carousel>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import hexo from '@/utils/hexoCommand'
import env from '@/utils/env'
const log = require('electron-log')
const _ = require('lodash')
export default {
  name: 'tutorials',
  data () {
    return {
      spinning: true,
      tutorial: false,
      tip: '检查系统环境中',
      steps: ['安装必要软件', '创建博客项目', '登陆Github', '测试部署', '奖励作者'],
      tempSettings: {
        title: '',
        name: '',
        code: ''
      },
      loading: {
        installHexo: false,
        initHexo: false
      },
      current: 0,
      envList: ['node', 'git', 'hexo', 'yarn'],
      needInstall: false,
      needInit: true,
      greenHand: false,
      needGithub: false,
      emptyFolder: true,
      badProject: false,
      missingFile: '',
      tempPath: ''
    }
  },
  methods: {
    checkEnv () {
      return new Promise(async (resolve, reject) => {
        for (const item of this.envList) {
          const version = await this.$envCheck(item).catch(error => {
            log.error(error)
          })
          if (version) {
            let actVersion
            switch (item) {
              case 'hexo':
                const versionArray = version.split('\n')
                let versionObj = {}
                for (const item of versionArray) {
                  let temp = item.split(':')
                  if (_.trim(temp[0]).length === 0) {
                    continue
                  }
                  versionObj[_.trim(temp[0])] = _.trim(temp[1])
                }
                actVersion = versionObj['hexo-cli']
                break
              default:
                const versionRegx = /\d{1,2}\.\d{1,2}\.\d{1,2}/
                actVersion = version.match(versionRegx)[0]
            }
            this.$store.commit(`SET_${item.toUpperCase()}_ENV`, {status: true, version: actVersion})
          }
        }
        resolve()
      })
    },
    installHexo () {
      this.loading.installHexo = true
      try {
        env.installHexo()
      } catch (e) {
        this.loading.installHexo = false
        return this.$error({
          title: '在安装Hexo时出现了问题，请截图反馈',
          content: e
        })
      }
      this.checkEnv()
      this.loading.installHexo = false
    },
    async initHexoProject () {
      this.loading.initHexo = true
      await hexo.hexoInit().catch(error => {
        this.loading.initHexo = false
        return this.$error({
          title: '在安装Hexo时出现了问题，请截图反馈',
          content: error
        })
      })
      // TODO: Do some Check
      this.$refs.hexo.next()
    },
    async getHexoConfig () {
      const baseSettings = await hexo.getHexoConfig()
      this.$store.commit('SET_HEXO_CONFIG_BASIC', baseSettings)
      const themeSettings = await hexo.getThemeConfig()
      this.$store.commit('SET_HEXO_CONFIG_THEME', themeSettings)
    },
    hexoDirDrag (e) {
      e.preventDefault()
      e.stopPropagation()
      this.tempPath = e.dataTransfer.files[0].path
    }
  },
  async mounted () {
    // Check os
    const osCheck = await this.$osCheck()
    if (this.$store.state.env.os.os === 'darwin') {
      const appList = await this.$marktextMacCheck().catch(err => {
        log.error(err)
      })
      this.$store.commit('SET_MARK_TEXT_ENV', {status: appList.indexOf('Mark Text.app') !== -1})
    }
    this.$store.commit('SET_OS_ENV', osCheck)
    // Check Env
    await this.checkEnv()
    // If has base Env
    if (this.$store.getters.baseEnv) {
      this.current = 1
      this.tip = '检查Hexo项目中'
      if (!this.$store.getters.hexoDir) {
        // Well...
        this.tutorial = true
        this.spinning = false
        return 0
      } else {
        const result = hexo.checkHexoDir({create: false})
        // sth wrong
        if (!result.status) {
          if (result.empty || !result.hasDir || result.missingFile) {
            this.$confirm({
              title: 'Hexo项目检查发现问题：',
              content: `${result.msg}，将会进入初始化向导`,
              okText: '好的',
              okType: 'danger',
              onOk () {
                this.tutorial = true
                this.spinning = false
                return 0
              }
            })
          }
        }
      }
      this.tip = '检查Github状态中'
      this.current = 2
      if (!this.$store.getters.user) {
        this.tutorial = true
        this.spinning = false
        return 0
      }
    } else {
      // If require env, start full tutorial.
      this.tutorial = true
    }
    if (!this.tutorial) {
      console.log('All Done!')
    }
    this.spinning = false
  }
}
</script>

<style scoped>
.env-carousel{
  margin: 18px 0 0 0;
}
.env-pic{
  width: 15vw;
  height: auto;
}
</style>
