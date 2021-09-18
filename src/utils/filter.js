import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
import {substr} from './substr.js'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('substr', function (str,length,rgb) {
	let obj={
		str:str,
		length:length,
		rgb:rgb
	}
  return substr(obj);
})

Vue.filter('statusType', function (__value,__status) {
	return __status[__value];
})


Vue.filter('typeType', function (__value, __type) {
	return __type[__value];
})


Vue.filter('isEmpty', function (__value,__type) {
  if(__value !== null && typeof __value !== 'undefined') return __value;
  if(__type){
    return '-';
  }else{
    return '0';
  }
})

Vue.filter('secondToDate', function (__value,__type) {
	var h = Math.floor(__value / 3600) < 10 ? '0'+Math.floor(__value / 3600) : Math.floor(__value / 3600);
    var m = Math.floor((__value / 60 % 60)) < 10 ? '0' + Math.floor((__value / 60 % 60)) : Math.floor((__value / 60 % 60));
    var s = Math.floor((__value % 60)) < 10 ? '0' + Math.floor((__value % 60)) : Math.floor((__value % 60));
   if(__value !== null && typeof __value !== 'undefined') {
      return __value = h + ":" + m + ":" + s;
   }
   if(__type){
      return '无';
    }else{
      return '0';
    }
})
