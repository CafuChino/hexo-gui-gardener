<template>
  <div>
    <a-space direction="vertical" style="width: 100%">
      <a-row :gutter="16">
        <a-col span="10">
          <a-input placeholder="文章标题" v-model="article.title"></a-input>
        </a-col>
        <a-col span="10">
          <a-button @click="drawer.visibility=true">设 置</a-button>
          <a-button type="primary" @click="submit">完 成</a-button>
          <a-button @click="openWithEditor" :loading="loading.openInEditor">使用编辑器打开</a-button>
        </a-col>
      </a-row>
      <mavon-editor
          ref="md"
          placeholder="请输入文档内容..."
          :boxShadow="false"
          class="editor"
          v-model="article.content"
          :toolbars="toolbars"
          @imgAdd="$imgAdd"
      />
    </a-space>
    <a-drawer
        title="文章设置"
        placement="right"
        :closable="true"
        :visible="drawer.visibility"
        @close="onDrawerClose"
    >
      <a-space  direction="vertical">
      <h3>类别：</h3>
      <a-tooltip>
        <template slot="title">
          直接输入即可，按回车确认
        </template>
        <a-select mode="tags" style="width: 100%;margin: 18px 0" :token-separators="[',']"
                  v-model="drawer.meta.categories"></a-select>
      </a-tooltip>
      <h3>Tag：</h3>
      <a-tooltip>
        <template slot="title">
          直接输入即可，按回车确认
        </template>
        <a-select mode="tags" style="width: 100%;margin: 18px 0" :token-separators="[',']"
                  v-model="drawer.meta.tags"></a-select>
      </a-tooltip>
      <h3>文章缩略图</h3>
        <a-empty>
          <span slot="description">未设置，将使用默认图片 <a>帮助</a></span>
          <a-button type="primary">设置图片</a-button>
        </a-empty>
      <h3>文章顶部图</h3>
        <a-empty>
          <span slot="description">未设置，将使用默认图片 <a>帮助</a></span>
          <a-button type="primary">设置图片</a-button>
        </a-empty>
      </a-space>
    </a-drawer>
  </div>
</template>

<script>
import hexo from '@/utils/hexoCommand'
const log = require('electron-log')
// const _ = require('lodash')
export default {
  name: 'Edit',
  data () {
    return {
      drawer: {
        visibility: false,
        meta: {
          categories: [],
          tags: [],
          comment: true,
          topImg: false,
          cover: false
        }
      },
      loading: {
        openInEditor: false
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      article: {
        content: '',
        title: ''
      },
      saveDraftInterval: 0
    }
  },
  methods: {
    // 上传图片方法
    $imgAdd (pos, $file) {
      console.log(pos, $file)
    },
    onDrawerClose () {
      this.drawer.visibility = false
    },
    saveToDraft () {
      const draft = {
        title: this.article.title,
        content: this.article.content,
        categories: this.drawer.meta.categories,
        tags: this.drawer.meta.tags
      }
      this.$store.commit('SET_DRAFT', draft)
    },
    async openWithEditor () {
      this.loading.openInEditor = true
      if (!this.check()) {
        this.loading.openInEditor = false
        return
      }
      try {
        let filePath = hexo.hexoNew({
          title: this.article.title,
          content: this.article.content,
          tags: this.drawer.meta.tags,
          categories: this.drawer.meta.categories,
          comments: this.drawer.meta.comment
        })
        this.loading.openInEditor = false
        this.$open(filePath)
        this.$router.push('/list')
      } catch (e) {
        log.error(e)
        this.loading.openInEditor = false
        return this.$message.error('保存失败')
      }
    },
    check () {
      // check every thing
      if (!this.article.title) {
        this.$message.warn('请填写标题')
        return false
      }
      if (!this.article.content) {
        this.$message.warn('请填写内容')
        return false
      }
      return true
    },
    submit () {

    }
  },
  async mounted () {
    if (!this.$store.getters.hexoDir) {
      this.$confirm({
        title: '你还没有初始化你的Hexo博客',
        content: '要现在去初始化吗？',
        onOk: () => {
          // TODO:Finish this.
          this.$router.push('/settings')
        },
        onCancel: () => {
          this.$message.warn('请记得前往“设置”=>“初始化Hexo”初始化您的项目')
        }
      })
    }
    if (this.$store.getters.hasDraft) {
      this.$confirm({
        title: '检查到自动保存',
        content: '要使用上次自动保存的内容吗',
        onOk: () => {
          // Use drafts
          this.drawer.meta.tags = [...this.$store.state.draft.tags]
          this.drawer.meta.categories = [...this.$store.state.draft.categories]
          this.article.title = this.$store.state.draft.title
          this.article.content = this.$store.state.draft.content
          this.saveDraftInterval = setInterval(() => {
            this.saveToDraft()
          }, 30000)
        },
        onCancel: () => {
          this.$store.commit('CLEAR_DRAFT')
          this.saveDraftInterval = setInterval(() => {
            this.saveToDraft()
          }, 30000)
        }
      })
    }
  }
}
</script>

<style scoped>
.editor {
  z-index: 1;
  border: 1px solid #d9d9d9;
  min-height: 60vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji';
}
</style>
