import { axios } from '@/utils/request'
import apindex from './index'
const serverName="/social/withdraw-manager"; //提现管理
const api = {
  getPayList: serverName+'/list-pay-audit', //get 获取打款审核列表
  getWithdrawList: serverName+'/list-withdraw', //get 获取提现记录
  getWithdrawAuditList: serverName+'/list-withdraw-audit', //get 获取提现审核列表
  payHandle: serverName+'/pay-audit', //post 打款操作
  withdrawHandle: serverName+'/withdraw-audit', //post 审核操作
  getBrandList:  '/social/user-manager/brand_list',//get 获取t_user表中的所有品牌信息
}
export default api

export function getPayList (parameter) {
  return axios({
    url: api.getPayList,
    method: 'get',
    params:parameter,
  })
}

export function getWithdrawList (parameter) {
  return axios({
    url: api.getWithdrawList,
    method: 'get',
    params:parameter,
  })
}


export function getWithdrawAuditList (parameter) {
  return axios({
    url: api.getWithdrawAuditList,
    method: 'get',
    params:parameter,
  })
}



export function payHandle (parameter) {
	let param={
    url: api.payHandle,
    method: 'post',
    params: {
      operate: parameter.operate,
      orderNumber: parameter.orderNumber,
    }
  };
  return axios(param)
}


export function getBrandList(parameter) {
  return axios({
    url: api.getBrandList,
    method: 'get',
    params: parameter
  })
}

export function withdrawHandle (parameter) {
	let param={
    url: api.withdrawHandle,
    method: 'post',
    params: {
      operate: parameter.operate,
      orderNumber: parameter.orderNumber,
      message: parameter.message
    }
  };
  return axios(param)
}

