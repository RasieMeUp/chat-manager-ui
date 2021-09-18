import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    loginName: '',
    orgName: '',//行政区域名称
    orgId: null,//行政区域编号
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { loginName, welcome }) => {
      state.loginName = loginName
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ORG_THINGS: (state, { orgId, orgName }) => {
      state.orgName = orgName;
      state.orgId = orgId;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      Vue.ls.set('SET_USERNAME', userInfo.username);
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, result.access_token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        const userParams = { Authorization: Vue.ls.get(ACCESS_TOKEN), name: Vue.ls.get('SET_USERNAME') }
        getInfo(userParams).then(response => {
          const result = response.data;
          const perms = ["app:other", "fzqc:xcjy", "flush:cache:browser", "fzqc:jqgl", "role:role", "zbdc:zzsrzf", "dict:update", "NOT_REQUIRED_HAVE_PERM", "handle:user:save", "qlzc:jsgl", "menu:delete", "zbdc:xzgl:update", "integral:config", "handle:user", "struct:delete", "system:system", "region:update", "ssp:edit", "notice:notice", "integral:config:update", "user:user", "app:upgrade", "handle:user:delete", "config:config", "xgsb:jftjs", "word:delete", "app:link", "cmgl:cmgl", "zbdc:djdsj", "xgsb:bgt", "system:user", "xgsb:reply", "zbdc:xzgl", "xgsb:xgsb", "ndpx:del", "region:region", "integral:config:save", "menu:save", "fzqc:njl", "stmc:zhgl", "flush:cache:data", "role:assignMenu", "struct:struct", "activity:batch", "log:log", "ddrc:ddrc", "ddrc:jdpx", "struct:update", "comments:status", "user:delete", "menu:menu", "cwfb:del", "comments:list", "dict:delete", "xgsb:sqtj", "advert:advert", "news:add", "cwfb:edit", "ddrc:ddjt", "user:resetPass", "ssp:batch", "resource:resource", "handle:user:update", "region:delete", "fzqc:fzqc", "comments:update", "zbdc:zbdc", "wmb:cmwmb", "stmc:ljfl", "word:edit", "dict:dict", "stmc:mlxc", "mzgc:cwgl", "menu:update", "zbdc:xzgl:delete", "xgsb:sqmylx", "integral:config:delete", "word:add", "app:upgrade:save", "zbdc:xzgl:save", "wmb:wmb", "pahc:pahc", "ssp:delete", "code:code", "mzgc:cwfb", "advert:advert:delete", "xgsb:jbx", "user:update", "sqlmonitor:sqlmonitor", "yfzc:zsdt", "mzgc:mzgc", "mzgc:swgk", "cwfb:select", "news:edit", "comments:comments", "app:push:mess:save", "activity:edit", "dict:save", "app:notify", "stmc:stmc", "activity:add", "zbdc:wggl", "xgsb:show", "role:update", "stmc:ssp", "zbdc:xzgl:bind:user", "system:user:delete", "ssp:add", "system:user:save", "struct:save", "system:user:update", "app:link:save", "advert:advert:update", "xgsb:xfdb", "advert:advert:save", "activity:delete", "yfzc:yfzc", "role:delete", "yfzc:fzxc", "news:batch", "xgsb:del", "zbdc:xxpx", "cmwd:list", "region:save", "app:setting", "fzqc:ms", "pahc:jg", "pahc:xxfb", "xgsb:hjwsjd", "news:delete", "qlzc:qlzc", "zbdc:djhd", "ndpx:edit", "cmwd:cmwd", "role:save", "user:batch", "user:active:list", "user:save", "qlzc:report"];
          // console.log( result.perms);
          // if (result.principal && result.principal.length > 0 ) {
          // commit('SET_ROLES',  result.perms)
          if (result.principal) {
            commit('SET_ROLES', perms)
            commit('SET_INFO', result.principal)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', { loginName: result.name, welcome: welcome() })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        resolve()
        // logout({}).then(() => {
        //   resolve()
        // }).catch(() => {
        //   resolve()
        // })
      })
    }

  }
}

export default user
