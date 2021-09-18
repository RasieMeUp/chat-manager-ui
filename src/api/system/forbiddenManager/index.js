import { axios } from '@/utils/request'
import apindex from './index'
const serverName = "/social/forbidden-manager"; //封号API
const api = {
  cancel: serverName + '/cancel', // post 解封
  getList:serverName +  "/list", //GET 获取封号列表
  put: serverName + '/put', // post 封号
  deviceForbiden: serverName + '/deviceForbiden', // 封号设备或者ip
  getDeviceForbiddenList:serverName +  "/list-forbidden", //GET 获取封号列表
  cancelDevice: serverName + '/device_cancel', // post 解封

}
export default api

export function cancel (parameter) {
	let param={
    url: api.cancel,
    method: 'post',
    params: {
      forbiddenId: parameter.forbiddenId,
    }
  };
  return axios(param)
}


export function cancelDevice (parameter) {
	let param={
    url: api.cancelDevice,
    method: 'post',
    params: {
      forbiddenId: parameter.forbiddenId,
    }
  };
  return axios(param)
}


export function put (parameter) {
	let param={
    url: api.put,
    method: 'post',
    params: {
      days: parameter.days,
      digitId: parameter.digitId,
      message: parameter.message,
    }
  };
  return axios(param)
}


export function deviceForbiden (parameter) {
	let param={
    url: api.deviceForbiden,
    method: 'post',
    params: {
      deviceId:parameter.deviceId,
      days: parameter.days,
      type: parameter.type,
      message: parameter.message,
    }
  };
  return axios(param)
}


export function getList(parameter) {
  return axios({
    url: api.getList,
    method: 'get',
    params: parameter
  })
}


export function getDeviceForbiddenList(parameter) {
  return axios({
    url: api.getDeviceForbiddenList,
    method: 'get',
    params: parameter
  })
}