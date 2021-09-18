import { axios } from '@/utils/request'
import apindex from './index'
const serverName="/social/config-manager"; //通用API
const api = {
  getListConfig:serverName +'/list-config', //GET  获取收费区间
}
export default api

export function getListConfig (parameter) {
  return axios({
    url: api.getListConfig,
    method: 'get',
    params:parameter,
  })
}
