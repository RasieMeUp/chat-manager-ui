import { axios } from '@/utils/request'
import apindex from './index'
const serverName='/activity'
const api = {
  page: serverName+'/page',
  save: serverName+'/save',
  getById: serverName+'/getByPk',
  update: serverName+'/update',
  delByPk: serverName+'/deleteByPk',
  selectUser: serverName+'/selectTreeUsers',
  batch: serverName + '/batch'
}
export default api

export function page (parameter) {
  return axios({
    url: api.page,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function save (parameter) {
  return axios({
    url: api.save,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: api.update,
    method: 'put',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function getById (parameter) {
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
export function selectUsers (parameter) {
  return axios({
    url: api.selectUser,
    method: 'get',
    params: parameter
  })
}

export function batch (parameter) {
  return axios({
    url: api.batch,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}


