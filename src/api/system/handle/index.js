import { axios } from '@/utils/request'
const serverName = "/handle";
const api = {
  page: serverName + '/page',
  save: serverName + '/save',
  getByPk: serverName + '/getByPk',
  update: serverName + '/update',
  delByPk: serverName + '/deleteByPk',
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

export function getByPk(parameter) {
  return axios({
    url: api.getByPk,
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



