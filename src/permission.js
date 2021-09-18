import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { strFormat } from "@/utils/util"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist


router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  let title = strFormat(domTitle, [""]);
  if (store.getters.orgName) {
    title = strFormat(domTitle, [store.getters.orgName]);
  }
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${title}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/dashboard/Analysis' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store
          .dispatch('GetInfo')
          .then(response => {
            // const perms = response.res.perms
            const perms = ["app:other", "fzqc:xcjy", "flush:cache:browser", "fzqc:jqgl", "role:role", "zbdc:zzsrzf", "dict:update", "NOT_REQUIRED_HAVE_PERM", "handle:user:save", "qlzc:jsgl", "menu:delete", "zbdc:xzgl:update", "integral:config", "handle:user", "struct:delete", "system:system", "region:update", "ssp:edit", "notice:notice", "integral:config:update", "user:user", "app:upgrade", "handle:user:delete", "config:config", "xgsb:jftjs", "word:delete", "app:link", "cmgl:cmgl", "zbdc:djdsj", "xgsb:bgt", "system:user", "xgsb:reply", "zbdc:xzgl", "xgsb:xgsb", "ndpx:del", "region:region", "integral:config:save", "menu:save", "fzqc:njl", "stmc:zhgl", "flush:cache:data", "role:assignMenu", "struct:struct", "activity:batch", "log:log", "ddrc:ddrc", "ddrc:jdpx", "struct:update", "comments:status", "user:delete", "menu:menu", "cwfb:del", "comments:list", "dict:delete", "xgsb:sqtj", "advert:advert", "news:add", "cwfb:edit", "ddrc:ddjt", "user:resetPass", "ssp:batch", "resource:resource", "handle:user:update", "region:delete", "fzqc:fzqc", "comments:update", "zbdc:zbdc", "wmb:cmwmb", "stmc:ljfl", "word:edit", "dict:dict", "stmc:mlxc", "mzgc:cwgl", "menu:update", "zbdc:xzgl:delete", "xgsb:sqmylx", "integral:config:delete", "word:add", "app:upgrade:save", "zbdc:xzgl:save", "wmb:wmb", "pahc:pahc", "ssp:delete", "code:code", "mzgc:cwfb", "advert:advert:delete", "xgsb:jbx", "user:update", "sqlmonitor:sqlmonitor", "yfzc:zsdt", "mzgc:mzgc", "mzgc:swgk", "cwfb:select", "news:edit", "comments:comments", "app:push:mess:save", "activity:edit", "dict:save", "app:notify", "stmc:stmc", "activity:add", "zbdc:wggl", "xgsb:show", "role:update", "stmc:ssp", "zbdc:xzgl:bind:user", "system:user:delete", "ssp:add", "system:user:save", "struct:save", "system:user:update", "app:link:save", "advert:advert:update", "xgsb:xfdb", "advert:advert:save", "activity:delete", "yfzc:yfzc", "role:delete", "yfzc:fzxc", "news:batch", "xgsb:del", "zbdc:xxpx", "cmwd:list", "region:save", "app:setting", "fzqc:ms", "pahc:jg", "pahc:xxfb", "xgsb:hjwsjd", "news:delete", "qlzc:qlzc", "zbdc:djhd", "ndpx:edit", "cmwd:cmwd", "role:save", "user:batch", "user:active:list", "user:save", "qlzc:report"];
            // store.dispatch('GenerateRoutes', {}).then(() => {
              store.dispatch('GenerateRoutes', { perms }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '登录超时!'
            })
            // store.dispatch('Logout').then(() => {
            //   next({ path: '/user/login', query: { redirect: to.fullPath } })
            // })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
