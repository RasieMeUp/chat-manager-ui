/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'

const serverName = '/social//user' //用户API
const api = {
  getProfile: serverName + '/profile', // GET 获取用户信息

  // userAsset: serverName + '/asset', // GET 获取用户资产信息
  // userCreate: serverName + '/create', // Post 创建用户
  // userExist: serverName + '/exist', // GET 判断用户是否已经存在
  // getIdentity: serverName + '/get-identity-info', // GET 获取最新的身份审核信息
  // userLogout: serverName + '/logout', // Post 退出账号
  // userProfile: serverName + '/profile', // GET 获取用户信息
  // requestIdentity: serverName + '/request-identity', // POST 请求身份审核
  // updataPhotos: serverName + '/update-photos', // POST 更新用户照片
  // updataProfile: serverName + '/update-profile', // POST 更新用户信息
  // updataVideo: serverName + '/update-video', // POST 更新用户视频
}
export default api



export function profile(parameter) {
  return axios({
    url: api.profile,
    method: 'get',
    params: parameter
  })
}

export function userAsset(parameter) {
  return axios({
    url: api.userAsset,
    method: 'get',
    params: parameter
  })
}


export function userCreate(parameter) {
  return axios({
    url: api.userCreate,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function userExist(parameter) {
  return axios({
    url: api.userExist,
    method: 'get',
    params: parameter
  })
}

export function getIdentity(parameter) {
  return axios({
    url: api.getIdentity,
    method: 'get',
    params: parameter
  })
}


export function userLogout(parameter) {
  return axios({
    url: api.userLogout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}


export function userProfile(parameter) {
  return axios({
    url: api.userProfile,
    method: 'get',
    params: parameter
  })
}

export function requestIdentity(parameter) {
  return axios({
    url: api.requestIdentity,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}


export function updataPhotos(parameter) {
  return axios({
    url: api.updataPhotos,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}


export function updataProfile(parameter) {
  return axios({
    url: api.updataProfile,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}


export function updataVideo(parameter) {
  return axios({
    url: api.updataVideo,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}