import { axios } from '@/utils/request'
import apindex from './index'
const serverName = "/social/invite-manager"; //邀请 API
const api = {
  getBind: serverName + '/bind', //GET获取邀请码用户信息
  postBind: serverName + '/bind', // post 关系绑定
}
export default api

export function getBind(parameter) {
  return axios({
    url: api.getBind,
    method: 'get',
    params: parameter
  })
}


export function postBind (parameter) {
	let param={
    url: api.postBind,
    method: 'post',
    params: {
      digitId: parameter.digitId,
      inviteCode: parameter.inviteCode
    }
  };
  return axios(param)
}
