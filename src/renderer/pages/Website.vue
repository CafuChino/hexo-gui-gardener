<template>
  <div>
    <a-card style="width:100%"
            :tab-list="tabList"
            :active-tab-key="tabSelected"
            @tabChange="key => onTabChange(key)">
      <a-form-model v-if="tabSelected==='basic'" :model="basic" :label-col="{span:2}" :wrapper-col="{span: 10}">
        <a-form-model-item label="网站名">
          <a-input v-model="basic.title" placeholder="填入你网站的标题" @change=""/>
        </a-form-model-item>
        <a-form-model-item label="副标题">
          <a-input v-model="basic.subtitle" placeholder="这部分会出现在网站标题的后半部分"/>
        </a-form-model-item>
        <a-form-model-item label="描述">
          <a-input v-model="basic.description" placeholder="简要的描述一下你的网站"/>
        </a-form-model-item>
        <a-form-model-item label="作者">
          <a-input v-model="basic.author" placeholder="输入你的名字"/>
        </a-form-model-item>
        <a-form-model-item label="网站地址">
          <a-input v-if="basic.url" v-model="basic.url" disabled/>
          <a-button v-else>检测或生成</a-button>
        </a-form-model-item>
        <a-form-model-item label="部署仓库">
          <a-input v-if="basic.deploy.repo" v-model="basic.deploy.repo" disabled/>
          <a-button v-else>检测或生成</a-button>
        </a-form-model-item>
      </a-form-model>
      <a-form-model v-else :model="theme" :label-col="{span:2}" :wrapper-col="{span: 10}">
        <a-form-model-item label="头像地址">
          <a-input v-model="theme.avatar.img" placeholder="填入你头像的Url"/>
        </a-form-model-item>
        <a-form-model-item label="首页头图">
          <a-input v-model="theme.index_img" placeholder="填入你首页的Url"/>
        </a-form-model-item>
        <a-form-model-item label="评论系统">
          <a-select :default-value="null" style="width: 120px" v-model="theme.comments.use">
            <a-select-option :value="null">不开启</a-select-option>
            <a-select-option value="Valine">Valine（建议）</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import hexo from '@/utils/hexoCommand'
// const _ = require('lodash')
export default {
  name: 'Config',
  data () {
    return {
      basic: {
        title: '',
        subtitle: '',
        author: '',
        url: '',
        deploy: {
          repo: ''
        }
      },
      theme: {},
      tabList: [{
        key: 'basic',
        // tab: 'tab1',
        tab: '基础设置'
      },
      {
        key: 'theme',
        tab: '主题设置'
      }],
      tabSelected: 'basic'
    }
  },
  methods: {
    onTabChange (key) {
      this.tabSelected = key
    }
  },
  watch: {
    basic: {
      handler (val) {
        hexo.writeHexoConfig(val)
      },
      deep: true
    }
  },
  async mounted () {
    if (!this.$store.getters.baseEnv) {
      const h = this.$createElement
      return this.$error({
        title: '无法获取博客设置',
        content: h('div', {}, [
          h('p', {}, '缺少依赖环境所以无法管理博客。如需帮助，请查阅帮助文档')
        ]),
        okText: '前往帮助',
        // TODO:Link to help page.
        onOk: () => {
          this.$electron.shell.openExternal('http://www.baidu.com')
          this.$router.push('/')
        }
      })
    }
    const baseSettings = await hexo.getHexoConfig()
    this.basic = {...baseSettings}
    const themeSettings = await hexo.getThemeConfig()
    this.theme = {...themeSettings}
  }
}
</script>

<style scoped>

</style>
