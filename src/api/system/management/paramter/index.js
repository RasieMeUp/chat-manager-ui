/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'

const serverName = '/social/config-manager'
const api = {
  getPriceConfig: serverName + '/get-price-config',
  getListConfig:  serverName +'/list-config',
  createPriceConfig:serverName+'/create-price-config',
  updateAppConfig:serverName+'/update-app-config',
  getListBanner:serverName+'/list-banner',
  delBanner:serverName+'/del-banner',
  paymentList:'/pay/payment/sku/list',
  updateSkuPayment:'/pay/payment/sku/updateSKU',
  deleteSuk:'/pay/payment/sku/delSku',
  delCofig:serverName+'/del-cofig',
  updatePhotos:serverName+'/update-photos',
}
export default api



export function getPriceConfig(parameter) {
  return axios({
    url: api.getPriceConfig,
    method: 'get',
    params: parameter
  })
}


export function getListConfig(parameter) {
    return axios({
      url: api.getListConfig,
      method: 'get',
      params: parameter,
      dataType: "json",
    })
  }


  export function paymentList(parameter) {
    return axios({
      url: api.paymentList,
      method: 'get',
      params: parameter
    })
  }



  export function delCofig(parameter) {
    return axios({
      url: api.updateAppConfig,
      method: 'post',
      params: {
        version: parameter.version
      }
    })
  }


  export function updateAppConfig(parameter) {
    return axios({
      url: api.updateAppConfig,
      method: 'post',
      params: {
        version: parameter.version,
        week: parameter.week,
        startTime: parameter.startTime,
        endTime: parameter.endTime,
        versionStatus: parameter.versionStatus,
        vedioActualIsFee: parameter.vedioActualIsFee,
        vedioViewIsFee: parameter.vedioViewIsFee,
        harassIsStart: parameter.harassIsStart,
      }
    })
  }

  
  export function updateSkuPayment(parameter) {
    return axios({
      url: api.updateSkuPayment,
      method: 'post',
      params: {
        skuId: parameter.skuId,
        coin: parameter.coin,
        originPrice: parameter.originPrice,
        discountPrice: parameter.discountPrice,
        discountPercent: parameter.discountPercent,
      }
    })
  }

    
  export function deleteSuk(parameter) {
    return axios({
      url: api.deleteSuk,
      method: 'post',
      params: {
        skuId: parameter.skuId,
      }
    })
  }
  

  export function createPriceConfig(parameter) {
    return axios({
      url: api.createPriceConfig,
      method: 'post',
      params: {
        msgPrice: parameter.msgPrice,
        videoPrice: parameter.videoPrice,
        voicePrice: parameter.voicePrice,
        videoPriceScope: parameter.videoPriceScope,
        voicePriceScope: parameter.voicePriceScope,
        msgPriceScope: parameter.msgPriceScope,
        giftPriceScope: parameter.giftPriceScope
      }
    })
  }


  export function getListBanner(parameter) {
    return axios({
      url: api.getListBanner,
      method: 'get',
      params: parameter
    })
  }


  export function delBanner(parameter) {
    return axios({
      url: api.delBanner,
      method: 'post',
      params: {
        bannerId: parameter.bannerId,
      }
    })
  }


  
  export function updatePhotos(parameter) {
    return axios({
      url: api.updatePhotos,
      method: 'post',
      params: {
        bannerId: parameter.bannerId
      }
    })
  }
