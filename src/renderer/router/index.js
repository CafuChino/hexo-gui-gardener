import Vue from 'vue'
import Router from 'vue-router'
import Edit from '@/pages/Edit'
import Settings from '@/pages/Settings'
import BlogList from '@/pages/List'
import WebsiteSettings from '@/pages/Website'
import Tutorials from '@/pages/Tutorials'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tutorials',
      component: Tutorials
    },
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/edit',
      name: 'EditPage',
      component: Edit
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/website',
      name: 'WebsiteSettings',
      component: WebsiteSettings
    },
    {
      path: '/list',
      name: 'BlogList',
      component: BlogList
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
