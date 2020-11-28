<template>
  <a-locale-provider :locale="locale">
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
      <a-layout-sider v-model="collapsed" collapsible
                      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
        <div class="logo"/>
        <a-menu theme="dark" :default-selected-keys="['panel']" mode="inline" @click="menuChange">
          <a-menu-item key="panel">
            <a-icon type="pie-chart"/>
            <span>面板</span>
          </a-menu-item>
          <a-sub-menu key="articles">
            <span slot="title"><a-icon type="user"/><span>文章</span></span>
            <a-menu-item key="new">
              新文章
            </a-menu-item>
            <a-menu-item key="list">
              文章管理
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="config">
            <span slot="title"><a-icon type="team"/><span>设置</span></span>
            <a-menu-item key="website">
              <a-icon type="setting"/>
              <span>网站设置</span>
            </a-menu-item>
            <a-menu-item key="system">
              <a-icon type="setting"/>
              <span>系统设置</span>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout :style="{ marginLeft: collapsed?'84px':'200px' }">
        <a-layout-header style="background: #fff; padding: 0">
          <a-page-header
              style="background-color: #ffffff; padding: 24px;"
              :title="title"
              :sub-title="subtitle"
          />
        </a-layout-header>
        <a-layout-content style="margin: 32px 16px">
          <router-view/>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Gardener ©2020 Made and Design By CafuChino
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'hexo-gui',
  data () {
    return {
      locale: zhCN,
      collapsed: true,
      title: '加载中……',
      subtitle: '软件正在进行基础的初始化工作'
    }
  },
  methods: {
    menuChange (item, key, keyPath) {
      if (this.$route.name === 'tutorials') {
        return
      }
      console.log(item, key, keyPath)
      switch (item.key) {
        case 'panel' :
          this.title = '面板'
          this.subtitle = '一目了然!'
          this.$router.push('/')
          break
        case 'new':
          this.title = '新建文章'
          this.subtitle = '一段新的旅程'
          this.$router.push('/edit')
          break
        case 'system':
          this.title = '系统设置'
          this.subtitle = ''
          this.$router.push('/settings')
          break
        case 'website':
          this.title = '网站设置'
          this.subtitle = '最关键的信息都在这儿了！'
          this.$router.push('/website')
          break
        case 'list':
          this.title = '文章管理'
          this.subtitle = ''
          this.$router.push('/list')
          break
      }
    }
  },
  async mounted () {
    console.log(process.env)
  }
}
</script>

<style>
.title {
  margin: 0 0 0 18px;
}

#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
