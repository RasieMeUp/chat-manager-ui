import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import config from '@/config'
import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'
import { message } from 'ant-design-vue/es'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const domainUrl = process.env.NODE_ENV === 'development' ? config.domainUrl.dev : config.domainUrl.pro
const fdfsUrl = process.env.NODE_ENV === 'development' ? config.fdfsUrl.dev : config.fdfsUrl.pro
// 创建 axios 实例
const service = axios.create({
  baseURL: baseUrl, // api base_url
  timeout: 20000 // 请求超时时间
})

const err = (error) => {
  console.log(ACCESS_TOKEN)
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '权限不足',
        description: data.msg
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      const response = error.response.data
      notification.error({
        message: '授权登录失败',
        description: (response.message ? response.message : '请检查账户密码是否正确')
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}


// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'bearer  ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.status === 200) {
    if (response.data.code === 7000) message.error(response.data.msg)
    if (response.data.code === 401) {
      window.location.href = '/'
    }
    if (response.config.responseType === 'blob') {
      return response
    } else {
      return response.data
    }
  } else {
    return Promise.reject(response)
  }
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios,
  baseUrl as ApiUrl,
  domainUrl,
  fdfsUrl
}
