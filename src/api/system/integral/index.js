import { axios } from '@/utils/request'
const serverName = "/integral";
const api = {
  page: serverName + '/list',
  userPage: serverName + '/user/list',
  userDetaliPage: serverName + '/user/list/detail',
  save: serverName + '/save',
  info: serverName + '/info',
  update: serverName + '/update',
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
export function userPage(parameter) {
  return axios({
    url: api.userPage,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}
export function userDetaliPage(parameter) {
  return axios({
    url: api.userDetaliPage,
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

export function info(parameter) {
  return axios({
    url: api.info,
    method: 'get',
    params: parameter
  })
}




