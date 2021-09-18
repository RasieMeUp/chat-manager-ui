import { axios } from '@/utils/request'
import apindex from './index'
const serverName = "/party/branch";
const api = {
  page: serverName + '/page',
  save: serverName + '/save',
  getById: serverName + '/getByPk',
  update: serverName + '/update',
  delByPk: serverName + '/deleteByPk',
  noBindpage: serverName + '/nobind/page',
  bindpage: serverName + '/bind/page',
  bind: serverName + '/bind/user',
  getUserById: serverName + '/user/getByPk',
  updateUser: serverName + '/user/update',
}
export default api
export function bind(parameter) {
  return axios({
    url: api.bind,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function updateUser(parameter) {
  return axios({
    url: api.updateUser,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}
export function getUserById(parameter) {
  return axios({
    url: api.getUserById,
    method: 'get',
    params: parameter
  })
}
export function page(parameter) {
  return axios({
    url: api.page,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function save(parameter) {
  return axios({
    url: api.save,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function update(parameter) {
  return axios({
    url: api.update,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function getById(parameter) {
  return axios({
    url: api.getById,
    method: 'get',
    params: parameter
  })
}


export function delByPk(parameter) {
  return axios({
    url: api.delByPk,
    method: 'delete',
    params: parameter
  })
}

export function noBindpage(parameter) {
  return axios({
    url: api.noBindpage,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}
export function bindpage(parameter) {
  return axios({
    url: api.bindpage,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

