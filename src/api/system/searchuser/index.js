
import { axios } from '@/utils/request'
export function selectUsers (parameter) {
  return axios({
    url: '/activity/selectTreeUsers',
    method: 'get',
    params: parameter
  })
}
