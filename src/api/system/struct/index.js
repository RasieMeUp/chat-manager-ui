import { axios } from '@/utils/request'
const serverName = "/struct";
const api = {
  page: serverName + '/selectTreeList',
  save: serverName + '/save',
  getById: serverName + '/info',
  update: serverName + '/update', 
  delByPk: serverName + '/delete',
  selectRoles: serverName + '/selectAllRoles',
  batch: serverName + '/batch',
  listByRole: serverName + '/listbyrole',
  treeStruct: serverName + '/selectTreeStruct',
}
export default api

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

export function batch(parameter) {
  return axios({
    url: api.batch,
    method: 'post',
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

export function selectRoles(parameter) {
  return axios({
    url: api.selectRoles,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function listByRole() {
  return axios({
    url: api.listByRole,
    method: 'get'
  })
}

export function treeStruct(parameter) {
  return axios({
    url: api.treeStruct,
    method: 'get',
    params: parameter
  })
}

