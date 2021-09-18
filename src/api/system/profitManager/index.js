import { axios } from '@/utils/request'
import apindex from './index'
const serverName="/social/profit-manager"; //收益管理
const api = {
  getAnchorCall: serverName+'/list-anchor-call', //get 获取主播通话收益列表
  getAnchorGift: serverName+'/list-anchor-gift', //get 获取主播礼物收益列表
  getAnchorMsg: serverName+'/list-anchor-msg', //get 获取主播私信收益列表
  getConsumerCall: serverName+'/list-consumer-call', //get 获取用户通话消费列表
  getConsumerGift: serverName+'/list-consumer-gift', //get 获取用户礼物消费列表
  getConsumerMsg: serverName+'/list-consumer-msg', //get 获取用户私信消费列表

}
export default api

export function getAnchorCall (parameter) {
  return axios({
    url: api.getAnchorCall,
    method: 'get',
    params:parameter,
  })
}

export function getAnchorGift (parameter) {
  return axios({
    url: api.getAnchorGift,
    method: 'get',
    params:parameter,
  })
}

export function getAnchorMsg (parameter) {
  return axios({
    url: api.getAnchorMsg,
    method: 'get',
    params:parameter,
  })
}

export function getConsumerCall (parameter) {
  return axios({
    url: api.getConsumerCall,
    method: 'get',
    params:parameter,
  })
}

export function getConsumerGift (parameter) {
  return axios({
    url: api.getConsumerGift,
    method: 'get',
    params:parameter,
  })
}

export function getConsumerMsg (parameter) {
  return axios({
    url: api.getConsumerMsg,
    method: 'get',
    params:parameter,
  })
}

