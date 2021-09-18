import { axios } from '@/utils/request'
import apindex from './index'
const serverName = "/social/user-manager"; //用户管理
const api = {
  anchorHandle: serverName + '/anchor-audit', // post 主播认证审核
  anchorRecommendHandle: serverName + '/config-recommend', // post 设置主播推荐
  getAnchor: serverName + '/list-anchor', // GET 获取主播用户列表
  getAnchorAudit: serverName + '/list-anchor-audit', //GET 获取主播认证审核列表
  getConsumer: serverName + '/list-consumer', //GET获取普通用户列表
  getAnchorRecommend: serverName + '/list-recommend', //GET获取推荐主播列表
  getProfile: serverName + '/profile', //GET获取用户信息(包含照片信息)
  updateUserProfile: serverName + '/update-user-profile', //post 更新用户信息
  updateUserProfileBase: serverName + '/update-user-profile-base', //post 更新用户信息-基础数据
  updateUserMaterials:serverName + '/update-userMaterials',

  getBrandList: serverName + '/brand_list',//get 获取t_user表中的所有品牌信息


  getAnchorAuditType: serverName + '/get-anchor-audit', //GET获取主播最近的所有类型审核


  getAnchorProfile: "/social/comm/anchor-profile", //GET 获取主播详情
  getAnchorList: "/social/comm/list-anchor", //GET 获取主播列表
  

  getProfileAudit: serverName + '/profile-audit', //GET主播审核界面-获取用户信息(包含照片信息)


  achorVideoAudit: serverName + '/anchor-video-audit', //Post 主播视频认证审核

  updatePhotos:serverName + '/update-photos',
  

}
export default api

export function anchorHandle (parameter) {
	let param={
    url: api.anchorHandle,
    method: 'post',
    params: {
      serialNumber: parameter.serialNumber,
      operate: parameter.operate,
      message: parameter.message,
    }
  };
  return axios(param)
}


export function uodatePhotos (parameter) {
	let param={
    url: api.uodatePhotos,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: {
      digitId: parameter.digitId,
    
    }
  };
  return axios(param)
}


export function achorVideoAudit (parameter) {
	let param={
    url: api.achorVideoAudit,
    method: 'post',
    params: {
      digitId : parameter.digitId,
      serialNumber: parameter.serialNumber,
      operate: parameter.operate,
      message: parameter.message,
    }
  };
  return axios(param)
}


export function anchorRecommendHandle (parameter) {
	let param={
    url: api.anchorRecommendHandle,
    method: 'post',
    params: {
      digitId: parameter.digitId,
      level: parameter.level,
      recommend: parameter.recommend,
      type: parameter.type,
      startTime: parameter.startTime,
      endTime: parameter.endTime,
      startTime2: parameter.startTime2,
      endTime2: parameter.endTime2,
    }
  };
  return axios(param)
}


export function getAnchor(parameter) {
  return axios({
    url: api.getAnchor,
    method: 'get',
    params: parameter
  })
}

export function getAnchorAudit(parameter) {
  return axios({
    url: api.getAnchorAudit,
    method: 'get',
    params: parameter
  })
}

export function getConsumer(parameter) {
  return axios({
    url: api.getConsumer,
    method: 'get',
    params: parameter
  })
}


export function getAnchorRecommend(parameter) {
  return axios({
    url: api.getAnchorRecommend,
    method: 'get',
    params: parameter
  })
}

export function getProfile(parameter) {
  return axios({
    url: api.getProfile,
    method: 'get',
    params: parameter
  })
}


export function getProfileAudit(parameter) {
  return axios({
    url: api.getProfileAudit,
    method: 'get',
    params: parameter
  })
}

export function updateUserMaterials(parameter) {
  return axios({
    url: api.updateUserMaterials,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
		},
    params: {
      serialNumber:parameter.serialNumber,
      coverName: parameter.coverName,
      digitId: parameter.digitId,
    }
  })
}

export function updatePhotos (parameter) {
  console.log(parameter)
  return axios({
    url: api.updatePhotos,
    method: 'post',
		headers: {
      'Content-Type': 'multipart/form-data'
		},
    data: parameter
  })
}

export function getAnchorAuditType(parameter) {
  return axios({
    url: api.getAnchorAuditType,
    method: 'get',
    params: parameter
  })
}


export function getAnchorProfile(parameter) {
  return axios({
    url: api.getAnchorProfile,
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

export function updateUserProfile (parameter) {
	let param={
    url: api.updateUserProfile,
    method: 'post',
    params: {
      digitId: parameter.digitId,//--
      nick: parameter.nick,//
      phone: parameter.phone,
      gender: parameter.gender,
      birth: parameter.birth, //
      city: parameter.city, //
      profession: parameter.profession,//
      labels: parameter.labels,//
      intro: parameter.intro,//

      videoProfitRatio: parameter.videoProfitRatio,
      voiceProfitRatio: parameter.voiceProfitRatio,
      msgProfitRatio: parameter.msgProfitRatio,
      giftProfitRatio: parameter.giftProfitRatio,

      callPrice: parameter.callPrice, //
      videoPrice: parameter.videoPrice, //
      messagePrice: parameter.messagePrice,//
      
    }
  };
  return axios(param)
}

export function updateUserProfileBase (parameter) {
	let param={
    url: api.updateUserProfileBase,
    method: 'post',
    params: {
      digitId: parameter.digitId,//--
      nick: parameter.nick,//
      phone: parameter.phone,
      gender: parameter.gender,
      birth: parameter.birth, //
      city: parameter.city, //
      profession: parameter.profession,//
      labels: parameter.labels,//
      intro: parameter.intro,//

      videoProfitRatio: parameter.videoProfitRatio,
      voiceProfitRatio: parameter.voiceProfitRatio,
      msgProfitRatio: parameter.msgProfitRatio,
      giftProfitRatio: parameter.giftProfitRatio,

      callPrice: parameter.callPrice, //
      videoPrice: parameter.videoPrice, //
      messagePrice: parameter.messagePrice,//
      
    }
  };
  return axios(param)
}

// nick: this.pageParam.nick,
// phone: this.pageParam.phone,
// gender: this.pageParam.gender,
// birth: this.profileData.birth+'',
// city: this.profileData.city,
// profession: this.profileData.profession,
// labels:this.profileData.labels,
// intro: this.profileData.intro,

// videoProfitRatio: this.profileData.videoProfitRatio*100+'%',
// voiceProfitRatio: this.profileData.voiceProfitRatio*100+'%',
// msgProfitRatio: this.profileData.msgProfitRatio*100+'%',
// giftProfitRatio: this.profileData.giftProfitRatio*100+'%',

// callPrice: this.profileData.callPrice,
// videoPrice: this.profileData.videoPrice,
// messagePrice: this.profileData.messagePrice,


