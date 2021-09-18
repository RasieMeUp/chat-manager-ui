import { axios } from '@/utils/request'
import apindex from './index'
const serverName = "/social/call-manager"; //通话管理
const api = {

  getCallList: serverName + '/list', // GET getCallList
  getCallDetail: serverName + '/detail', // GET getDetail
 
}
export default api

export function getCallList(parameter) {
  return axios({
    url: api.getCallList,
    method: 'get',
    params: parameter
  })
}

export function getCallDetail(parameter) {
  return axios({
    url: api.getCallDetail,
    method: 'get',
    params: parameter
  })
}