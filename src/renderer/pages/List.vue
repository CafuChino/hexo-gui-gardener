<template>
  <div>
    <a-row :gutter="16">
      <a-col span="16">
        <a-card title="概览">
          <a-skeleton active />
        </a-card>
      </a-col>
      <a-col span="8">
        <a-card title="列表">
          <a-list item-layout="vertical" :pagination="pagination" size="large"  :data-source="db.models.Post">
            <div slot="footer">由<b>陌谦</b>自豪地献上！</div>
            <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
              <template v-for="{ type, text } in actions" slot="actions">
        <span :key="type" @click="action(type, item._id)">
          <a-icon :type="type" style="margin-right: 8px" />
          {{ text }}
        </span>
              </template>
              <a-list-item-meta :description="timeFormat(item.date)">
                <a slot="title" :href="item.href">{{ item.title }}</a>
                <a-avatar slot="avatar">{{item.title[0]}}</a-avatar>
              </a-list-item-meta>
<!--              <img :src="item.cover" class="cover" alt="">-->
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import hexo from '@/utils/hexoCommand'
const moment = require('moment')
const log = require('electron-log')
const _ = require('lodash')
const path = require('path')
export default {
  name: 'List',
  data () {
    return {
      db: {},
      actList: [],
      actions: [
        { type: 'edit', text: '编辑' },
        { type: 'delete', text: '删除' }
      ],
      pagination: {
        onChange: page => {
          console.log(page)
        },
        pageSize: 4
      }
    }
  },
  methods: {
    async refreshDb () {
      hexo.hexoGenerate({
        clean: true,
        onOut: (data) => {
          log.log(data)
        },
        onError: (data) => {
          log.error(data)
        },
        onExit: async (code) => {
          log.log(code)
          const hexoDb = await hexo.getHexoDb(this.$store.state.settings.hexo.baseDir)
          log.log(hexoDb)
          this.db = {...JSON.parse(hexoDb)}
        }
      })
    },
    timeFormat (time) {
      return moment(time).format('YYYY-MM-DD HH:MM:SS')
    },
    findArticle (id) {
      return _.findIndex(this.db.models.Post, {_id: id})
    },
    action (type, id) {
      switch (type) {
        case 'edit':
          this.edit(id)
          break
        case 'delete':
          this.$confirm({
            title: '确定要删除文章吗？',
            onOk: () => {
              this.delete(id)
            }
          })
          break
      }
    },
    edit (id) {
      const index = this.findArticle(id)
      if (index === -1) {
        return this.$message.error('文章不存在')
      }
      this.$open(path.join(this.$store.getters.hexoDir, 'source', this.db.models.Post[index].source))
    },
    delete (id) {
      const index = this.findArticle(id)
      if (index === -1) {
        return this.$message.error('文章不存在')
      }
      const result = hexo.hexoDelete(path.join(this.$store.getters.hexoDir, 'source', this.db.models.Post[index].source))
      if (result) {
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败')
      }
      this.refreshDb()
    }
  },
  async mounted () {
    if (!this.$store.getters.baseEnv) {
      const h = this.$createElement
      return this.$error({
        title: '无法获取博客状态',
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
    this.refreshDb()
  }
}
</script>

<style scoped>
.cover{
  width: 100%;
  height: auto;
}
</style>
