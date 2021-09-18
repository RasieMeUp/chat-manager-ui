import { axios } from '@/utils/request'
import apindex from './index'
const serverName="/social/recharge-manager"; //动态API
const api = {
  rechargeList: serverName+'/list-recharge', // GET 获取充值记录
  getBrandList:  '/social/user-manager/brand_list',//get 获取t_user表中的所有品牌信息
}
export default api

export function rechargeList (parameter) {
  return axios({
    url: api.rechargeList,
    method: 'get',
    params: parameter
  })
}

export function getBrandList(parameter) {
  return axios({
    url: api.getBrandList,
    method: 'get',
    params: parameter
  })
}