<template>
   <a-spin :spinning="confirmLoading" >
      <a-card>

        <a-card-grid class="card-box" style="width: 33%">
          <a-card-meta title="通话信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">发起人：</a-col>
                <a-col flex="auto">{{ profileData.callNick |  isEmpty(true) }} </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">接听人：</a-col>
                <a-col flex="auto">{{ profileData.acceptNick |  isEmpty(true) }} </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">通话类型：</a-col>
                <a-col flex="auto">{{ profileData.type |   statusType(callTypes) }} </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">通话时长：</a-col>
                <a-col flex="auto"> {{ profileData.duration | secondToDate(false) }} </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">发起时间：</a-col>
                <a-col flex="auto">{{ profileData.startTime |  isEmpty(true) }} </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">结束时间：</a-col>
                <a-col flex="auto">{{ profileData.endTime |  isEmpty(true) }} </a-col>
              </a-row>
            </template>
          </a-card-meta>
        </a-card-grid>


        <a-card-grid class="card-box" style="width: 33%">
          <a-card-meta title="消费信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">用户消费：</a-col>
                <a-col flex="auto">{{ profileData.consume |  isEmpty(false) }} 聊币</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">主播总收益：</a-col>
                <a-col flex="auto">{{ profileData.profit |  isEmpty(false) }} 聊币</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">视频收益：</a-col>
                <a-col flex="auto">{{ profileData.type==1 ? profileData.profit : 0 |  isEmpty(false) }} 聊币</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">语音收益：</a-col>
                <a-col flex="auto">{{ profileData.type==0 ? profileData.profit : 0 |  isEmpty(false) }} 聊币</a-col>
              </a-row>
              <!-- <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">礼物收益：</a-col>
                <a-col flex="auto">{{ profileData.videoCoin |  isEmpty(false) }} 聊币</a-col>
              </a-row> -->
               <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">视频卡：</a-col>
                <a-col flex="auto">{{ profileData.freeCard |  isEmpty(true) }}</a-col>
              </a-row>
             
            </template>
          </a-card-meta>
        </a-card-grid>




        <a-card-grid class="card-box" style="width: 33%">
          <a-card-meta title="主播信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">视频收费：</a-col>
                <a-col flex="auto">{{ profileData.videoPrice |  isEmpty(false) }}/分钟</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">语音收费：</a-col>
                <a-col flex="auto">{{ profileData.audioPrice |  isEmpty(false) }}/分钟</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">音视频分成：</a-col>
                <a-col flex="auto">{{ profileData.type==0 ? profileData.videoRatio*100 : profileData.audioRatio*100  |  isEmpty(false) }} %</a-col>
              </a-row>
              <!-- <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="90px">礼物分成：</a-col>
                <a-col flex="auto"> {{ profileData | secondToDate(false) }} 50%</a-col>
              </a-row> -->
            </template>
          </a-card-meta>
        </a-card-grid>

      </a-card>
    </a-spin>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import pick from 'lodash.pick'
import { getCallDetail } from "@/api/system/callManager";
import { STable } from "@/components";
import {  dataTypes ,genderTypes ,anchorStatus,callTypes } from "@/config/serverstatus";

export default {
  name: "callLogDetail",
  components: {
    STable,
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      dataTypes,
      genderTypes,
      callTypes,
      anchorStatus,
      imgModal: false,
      videoModal: false,
      imgModalUrl: "",
      handleOk: false,
      // 查询参数
      queryParam: {},
      // 传值参数
      pageParam: {},
      // 个人信息结果数据
      profileData: {},
      labelCol: {
        xs: { span: "auto" },
        sm: { span: "100px" },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      desc: "",
      confirmLoading:false,
    };
  },
  created() {
     this.confirmLoading = true; 
  },
   filters: {
    statusType(__value, __status) {
      return __status[__value];
    },
    isEmpty(__value,__type) {
      if(__value !== null) return __value;
      if(__type){
        return '-';
      }else{
        return '0';
      }
    },
    secondToDate(__value,__type){
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
    }
  },
  methods: {
    edit(record){
      this.pageParam = record;
      console.log("通话记录详情==>", this.pageParam);
      this.$nextTick(()=>{
        this.loadProfileData();
      });
    },
   
    handleCancel(e) {
      this.imgModal = false;
      this.videoModal = false;
    },

    //个人信息
    loadProfileData() {
      getCallDetail({ callId :  this.pageParam.callId }).then((response) => {
        this.profileData = response.data;
        console.log("getCallDetail ==> " ,this.profileData);
         this.confirmLoading = false;
      });
    },

  },
};
</script>
<style lang="less" scoped>
.card-box {box-shadow:none !important;&-li {padding:3px 0;.ant-col:last-child {color:#000;font-weight:bold;}
}
}
.card-sh {background:#fff;padding:10px;border:1px solid #e8e8e8;border-top:0;.ant-btn {margin-left:15px;}
}
.photo-li {width:100%;padding-bottom:0;position:relative;.photo-img {position:absolute;top:0;left:0;width:100%;height:100%;}
.video-icon {position:absolute;top:50%;left:50%;z-index:2;transform:translate(-50%,-50%);}
}
.tk-table {margin-top:10px;}
.shenh-handle {border:1px solid #eee;boder-top:0;margin-top:-1px;border-bottom:0;padding:20px;background:#fff;}
.shenh-handle2 {border:0;margin:0;padding:20px 0;}
.shenh-handle span {padding:0 10px;}
.video-box {position:relative;}
.video-open {position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;}
.ant-form-item{ margin-bottom:0;}
.ant-row-flex{align-items: center;}
.card-box-li{ padding:1px 0;}
.ant-drawer-right .ant-drawer-content-wrapper{height:50% !important;}
</style>
