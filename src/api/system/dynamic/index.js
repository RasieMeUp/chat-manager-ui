import { axios } from '@/utils/request'
import apindex from './index'
const serverName = "/social/dynamic"; //动态API
const api = {
  addComment: serverName + '/add-comment', // POST 添加评论
  create: serverName + '/create', // POST 创建动态
  delComment: serverName + '/del-comment', // POST 删除评论
  heart: serverName + '/heart', // POST 点赞或者取消
  followList: serverName + '/list-by-follow', // POST 关注的人的动态列表
  userList: serverName + '/list-by-user', // POST 获取某个用户的动态列表
  commentsList: serverName + '/list-comments', // POST 获取评论列表
  latestList: serverName + '/list-latest', // POST 获取最新的动态列表


  del: '/social/dyamic-manager/del', //  POST 删除动态
  list: '/social/dyamic-manager/list', //  get 获取动态列表

  guardList: '/social/dyamic-manager/guard-list', //  get 获取守护动态列表

  audit: '/social/dyamic-manager/audit', //  post 动态审核

  guardChange:'/social/dyamic-manager/guard-change',//post 切换守护和非守护动态


}
export default api

export function addComment(parameter) {
  return axios({
    url: api.addComment,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function create(parameter) {
  return axios({
    url: api.create,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function delComment(parameter) {
  return axios({
    url: api.delComment,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function heart(parameter) {
  return axios({
    url: api.heart,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function followList(parameter) {
  return axios({
    url: api.followList,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function userList(parameter) {
  return axios({
    url: api.userList,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}



export function commentsList(parameter) {
  let param = {
    url: api.commentsList,
    method: 'post',
    params: {
      commentId: parameter.commentId,
      pageIndex: parameter.pageIndex,
      pageSize: parameter.pageSize,
    }
  };
  return axios(param)
}




export function latestList(parameter) {
  let param = {
    url: api.latestList,
    method: 'post',
    params: {
      pageIndex: parameter.pageIndex,
      pageSize: parameter.pageSize,
    }
  };
  return axios(param)
}






export function del(parameter) {
  let param = {
    url: api.del,
    method: 'post',
    params: {
      dynamicId : parameter.dynamicId
    }
  };
  return axios(param)
}

export function list(parameter) {
  return axios({
    url: api.list,
    method: 'get',
    params: parameter
  })
}

export function guardList(parameter) {
  return axios({
    url: api.guardList,
    method: 'get',
    params: parameter
  })
}




export function audit(parameter) {
  let param = {
    url: api.audit,
    method: 'post',
    params: {
      dynamicId : parameter.dynamicId,
      pass : parameter.pass,
      message : parameter.message
    }
  };
  return axios(param)
}



export function guardChange(parameter) {
  let param = {
    url: api.guardChange,
    method: 'post',
    params: {
      dynamicId : parameter.dynamicId,
      isGuard : parameter.isGuard
    },
  };
  return axios(param)
}



