import { axios } from '@/utils/request'
import apindex from './index'
const serverName="/auth/cms"; //动态API
const api = {
  creatUser: serverName + '/create', // POST 创建用户
  creatManager: serverName + '/create-manager', // POST 创建管理员角色账户(需要超管权限)
  creatCustomer: serverName + '/create-customer-service',  //POST 创建客服角色账户(需要管理者权限)
  creatFinance: serverName + '/create-finance',  //POST 创建财务角色账户(需要管理者权限)
  creatOperate: serverName +  '/create-operate', // POST 创建运营角色账户(需要管理者权限)
}
export default api

export function creatUser (parameter) {
  return axios({
    url: api.creatUser,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function creatManager (parameter) {
  return axios({
    url: api.creatManager,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}


export function creatCustomer (parameter) {
  return axios({
    url: api.creatCustomer,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}



export function creatFinance (parameter) {
  return axios({
    url: api.creatFinance,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}



export function creatOperate (parameter) {
  return axios({
    url: api.creatOperate,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}
