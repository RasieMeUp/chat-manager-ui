<template>
   <a-spin :spinning="confirmLoading" >
    <a-form :form="form">
      <a-card>
        <a-card-grid class="card-box" style="width: 25%">
          <a-card-meta title="账号信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">用户ID：</a-col>
                <a-col flex="auto">{{ pageParam.digitId | isEmpty(true) }}</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">头像：</a-col>
                <a-col flex="auto"
                  ><a-avatar
                    shape="square"
                    :size="64"
                    icon="user"
                    :src="profileData.headThumbnailUrl"
                    @click="openBigImg(profileData.headUrl)"
                /></a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">昵称：</a-col>
                <a-col flex="auto">
                  {{pageParam.nick  | isEmpty(true) }}
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">粉丝数：</a-col>
                <a-col flex="auto">{{ profileData.follows | isEmpty(true) }}</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">注册时间：</a-col>
                <a-col flex="auto">{{ pageParam.createTime |  isEmpty(true)  }}</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">注册IP：</a-col>
                <a-col flex="auto">无字段……</a-col>
              </a-row>
            </template>
          </a-card-meta>
        </a-card-grid>
        <a-card-grid class="card-box" style="width: 25%">
          <a-card-meta title="个人信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">手机号：</a-col>
                <a-col flex="auto">
                  {{ pageParam.phone | isEmpty(true) }}
                  <!-- <a-form-item>
                    <a-input  v-decorator="['phone', {rules: [{required: true, min: 11, message: '请输入手机号'}]}]" />
                  </a-form-item> -->
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">性别：</a-col>
                <a-col flex="auto">
                  {{ profileData.gender |  statusType(genderTypes) }}
                    <!-- <a-form-item>
                      <a-select v-decorator="['gender', {rules: [{required: true,  message: '请选择性别'}]}]" >
                        <a-select-option :value="0"> 女 </a-select-option>
                        <a-select-option :value="1"> 男 </a-select-option>
                      </a-select>
                    </a-form-item> -->
                  </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">生日</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.birth}} -->
                  <a-form-item>
                    <a-input  v-decorator="['birthDay', {rules: [{ message: '请输入生日'}]}]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <!-- <a-row class="card-box-li" type="flex">
                <a-col flex="70px">年龄：</a-col>
                <a-col flex="auto">{{ profileData.age }}</a-col>
              </a-row> -->
              <!-- <a-row class="card-box-li" type="flex">
                <a-col flex="70px">星座：</a-col>
                <a-col flex="auto">{{ profileData.constellation }}</a-col>
              </a-row> -->
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">所在城市：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.city }} -->
                  <a-form-item>
                    <a-input  v-decorator="['city', {rules: [{message: '请输入所在城市'}]}]" />
                  </a-form-item>

                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">职业：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.profession }} -->
                   <a-form-item>
                    <a-input  v-decorator="['profession', {rules: [{ message: '请输入职业'}]}]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">个性标签：</a-col>
                <a-col flex="auto">
                  <!-- <span v-for="(label, index) in profileData.labels" :key="index">{{ label.name }}</span> -->
                  <a-form-item>
                    <a-input  v-decorator="['labels', {rules: [{ message: '请输入个性标签'}]}]" />
                  </a-form-item>
                  
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">语音介绍：</a-col>
                <a-col flex="auto"
                  ><audio
                    style="width: 200px; height: 50px"
                    :src="profileData.voiceUrl"
                    preload="auto"
                    controls
                  ></audio
                ></a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">个人签名：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.intro }} -->
                  <a-form-item>
                    <a-input  v-decorator="['intro', {rules: [{min: 3, message: '请输入个人签名'}]}]" />
                  </a-form-item>
                </a-col>
              </a-row>
            </template>
          </a-card-meta>
        </a-card-grid>
        <a-card-grid class="card-box" style="width: 25%">
          <a-card-meta title="聊天信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">视频消费</a-col>
                <a-col flex="auto">{{ pageParam.videoCoin |  isEmpty(false) }} 聊币 <a-tag  @click="openxiaof('1')" v-has="{perm:'cwfb:edit'}">查看更多</a-tag></a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">语音消费：</a-col>
                <a-col flex="auto">{{ pageParam.audioCoin |  isEmpty(false) }}聊币 <a-tag  @click="openxiaof('0')" v-has="{perm:'cwfb:edit'}">查看更多</a-tag></a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">私信消费：</a-col>
                <a-col flex="auto">{{ pageParam.messageCoin |  isEmpty(false) }}聊币  <a-tag  @click="openxiaof('2')" v-has="{perm:'cwfb:edit'}">查看更多</a-tag></a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">礼物消费：</a-col>
                <a-col flex="auto">{{ pageParam.giftCoin |  isEmpty(false) }}聊币  <a-tag  @click="openxiaof('3')" v-has="{perm:'cwfb:edit'}">查看更多</a-tag></a-col>
              </a-row>

            </template>
          </a-card-meta>

<!--设备登录信息 显示对应用户的设备和IP -->
          <a-card-meta title="登录信息">
            <template slot="description">
              <a-row v-for="(item,index) in userDeviceList" :key="item" class="card-box-li" type="flex" style="margin-top:8px;"     >
                <a-col flex="70px">设备{{index+1}}</a-col>
                <a-col flex="auto">{{ item.deviceAndroidId |  isEmpty(false) }} <a-tag  @click="fobbiden(item,1)" v-has="{perm:'cwfb:edit'}">封锁</a-tag></a-col>
              </a-row>

               <a-row v-for="(item,index) in userDeviceIpList" :key="item" class="card-box-li" type="flex" style="margin-top:8px;" >
                <a-col flex="70px">ip{{index+1}}</a-col>
                <a-col flex="auto">{{ item.ipAddr |  isEmpty(false) }} <a-tag  @click="fobbiden(item,2)" v-has="{perm:'cwfb:edit'}">封锁</a-tag></a-col>
              </a-row>
             
            </template>
          </a-card-meta>

        </a-card-grid>
        <a-card-grid class="card-box" style="width: 25%" >
          <a-card-meta title="账户信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px" style="color:#f00">充值金额：</a-col>
                <a-col flex="auto" style="color:#f00">无字段…… 聊币/分钟  <a-tag  @click="chongzhandle()">充值记录</a-tag> 
                    <!-- <a-menu class="content-link">
                    <a-menu-item key="/chongztxManager/tix/index" v-has="{ perm: 'role:delete' }">
                      <router-link :to="{ name: 'tixList', params: {} }">
                        提现记录
                      </router-link>
                    </a-menu-item>
                  </a-menu> -->

                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px" style="color:#f00">账户余额：</a-col>
                <a-col flex="auto" style="color:#f00">{{ pageParam.coin | isEmpty(false)  }}聊币/分钟</a-col>
              </a-row>
            </template>
          </a-card-meta>
        </a-card-grid>
      </a-card>
    </a-form>

    <!-- <div class="card-sh">
      审核结果：<span :class="[ auditProfile == '30' ? 'fnt-success': 'fnt-error']">{{ auditProfile | statusType(anchorStatus) }}</span>
      <a-button type="danger" v-if="auditProfile==10 ?true:false" @click="auditHandle(pageParam, '个人资料审核')"
        >审核</a-button
      >
    </div> -->

    <a-card style="margin-top: 15px">
      <a-card-grid class="card-box" style="width: 25%">
        <a-card-meta title="TA的相册">
          <template slot="description">
            <a-row :gutter="[10, { xs: 8, sm: 16, md: 5, lg: 10 }]">
              <a-col
                :span="8"
                v-for="(photoUrl, index) in profileData.photoThumbnailUrlList"
                :key="index"
                @click="openBigImg(profileData.photoUrlList[index])"
              >
                <div class="photo-li">
                  <a-avatar
                  shape="square"
                  :size="90"
                  :src="photoUrl"
                  @click="openBigImg(photoUrl)"
              />
                </div></a-col>
            </a-row>
            <!-- <div class="card-sh" style="border: 0; padding-left: 0">
              审核结果：<span :class="[ auditPhoto == '30' ? 'fnt-success': 'fnt-error']">{{ auditPhoto | statusType(anchorStatus) }}</span>
              <a-button type="danger"  v-if=" auditPhoto == 10 ? true : false"  @click="auditHandle(pageParam, '相册审核')"
                >审核</a-button
              >
            </div> -->
          </template>
        </a-card-meta>
      </a-card-grid>
      <!-- <a-card-grid class="card-box" style="width: 25%" v-if='false'>
        <a-card-meta title="TA的视频">
          <template slot="description">
            <div class="video-box" @click="openBigVideo()">
              <div class="video-open"></div>
              <video
                class="video-box"
                id="demoVideo"
                style="width: 50%"
                controls="false"
                enable-progress-gesture="false"
                show-center-play-btn="false"
                :src="profileData.videoUrl"
              ></video>
            </div>
            
            <div class="card-sh" style="border: 0; padding-left: 0">
              审核结果：<span :class="[ auditVideo == '30' ? 'fnt-success': 'fnt-error']">{{auditVideo | statusType(anchorStatus)}}</span>
              <a-button type="danger"  v-if=" auditVideo == 10 ? true : false"  @click="auditHandle(pageParam, '视频审核')"
                >审核</a-button
              >
            </div>
          </template>
        </a-card-meta>
      </a-card-grid> -->
    </a-card>


    <!-- <div class="card-sh" style="margin-top:20px;">
      <a-button type="danger" @click="handleSeal()" v-has="{perm:'role:update'}">封号</a-button>
      <a-button type="primary" @click="handleEdit()">修改</a-button>
    </div> -->

    <a-modal
      title=""
      :visible="imgModal"
      :confirm-loading="false"
      :footer="null"
      @cancel="handleCancel"
    >
      <p><img class="photo-img" :src="imgModalUrl" style="width: 100%" /></p>
    </a-modal>

    <a-modal
      title=""
      :visible="videoModal"
      :confirm-loading="false"
      :footer="null"
      :width="500"
      @cancel="handleCancel"
    >
      <video
        class="video-box"
        id="demoVideo"
        style="width: 100%"
        controls="true"
        enable-progress-gesture="true"
        show-center-play-btn="true"
        :src="profileData.videoUrl"
      ></video>
    </a-modal>

    <a-modal
      :title="shModalT"
      :visible="shModal"
      :confirm-loading="false"
      ok-text="审核通过"
      cancel-text="审核不通过"
      :footer="null"
      @cancel="shHandleCancel"
      width="400px"
    >
      备注：<a-input v-model="desc"  type="textarea" placeholder="请填写备注信息" />
      <div style="text-align: center; padding: 30px 0 0 0">
        <a-button
          type="primary"
          size="large"
          @click="shHandleOk(1)"
          style="margin-right: 50px"
        >
          审核通过
        </a-button>
        <a-button type="danger" size="large" @click="shHandleOk(0)">
          审核不通过
        </a-button>
      </div>
    </a-modal>

  <form-handle-seal ref="formHandleSeal" @ok="handleOk" />
  <form-handle-edit-device ref="formHandleEditDevice" @ok="handleOk" />
<form-handle-invite ref="formHandleInvite" @ok="handleOk" />

    <a-drawer
      :title="drawer01.title"
      :width="drawer01.width"
      :maskClosable="false"
      :visible="drawer01.visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=>{drawer01.visible=false}"
    >
      <chongz-handle ref="chongzHandle" @ok="handleOk" />
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="()=>{drawer01.visible=false}">关闭</a-button>
      </div>
    </a-drawer>


    <a-drawer
      :title="drawer02.title"
      :maskClosable="false"
      :visible="drawer02.visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=>{drawer02.visible=false}"
    >
      <xiaof-handle ref="xiaofHandle" @ok="handleOk" />
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="()=>{drawer02.visible=false}">关闭</a-button>
      </div>
    </a-drawer>
    </a-spin>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import formHandleSeal from "@/views/user/zhub/seal";
import formHandleInvite from "@/views/user/zhub/invite";
import chongzHandle from "@/views/chongztx/chongz/index"
import xiaofHandle from "@/views/userxf/xiaof/index"
import formHandleEditDevice from "@/views/user/fengh/editDevice"

import pick from 'lodash.pick'
import { anchorHandle, getProfile ,getAnchorAuditType} from "@/api/system/userManager";
import { STable } from "@/components";
import {
  getAnchorCall,
  getAnchorGift,
  getAnchorMsg,
  getConsumerCall,
  getConsumerGift,
  getConsumerMsg,
} from "@/api/system/profitManager";
import { updateUserProfileBase } from "@/api/system/userManager";
import {  dataTypes ,genderTypes ,anchorStatus } from "@/config/serverstatus";

export default {
  name: "zhubDetail",
  components: {
    STable,formHandleSeal,formHandleInvite,chongzHandle,xiaofHandle,formHandleEditDevice
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      drawer01: {
        visible: false,
        title: '充值记录'
      },
      drawer02: {
        visible: false,
        title: '消费记录'
      },
      dataTypes,
      genderTypes,
      anchorStatus,
      imgModal: false,
      videoModal: false,
      shModal: false,
      shModalT: "",
      imgModalUrl: "",
      handleOk: false,
      // 查询参数
      queryParam: {},
      // 传值参数
      pageParam: {},
      // 个人信息结果数据
      profileData: {},
      userDeviceList:[],
      userDeviceIpList:[],
      labelCol: {
        xs: { span: "auto" },
        sm: { span: "100px" },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      desc: "",
      auditProfile:'-1',
      auditPhoto:'-1',
      auditVideo:'-1',
      auditProfileSerialNumber :'-1',
      auditPhotoSerialNumber:'-1',
      auditVideoSerialNumber:'-1',
      form: this.$form.createForm(this),
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
  },
  methods: {
    edit(record){
      this.pageParam = record;
      console.log("用户列表信息==>", this.pageParam);
      this.$nextTick(()=>{
        this.loadProfileData();
      });
    },
    openBigVideo() {
      this.videoModal = true;
    },
    openBigImg(__url) {
      this.imgModalUrl = __url;
      this.imgModal = true;
    },
    handleCancel(e) {
      this.imgModal = false;
      this.videoModal = false;
    },

    //个人信息
    loadProfileData() {
      getProfile({ digitId:  this.pageParam.digitId }).then((response) => {
        this.profileData = response.data;
        this.userDeviceList=response.data.userDeviceList
        this.userDeviceIpList=response.data.userDeviceIpList
        console.log("用户 profileData ==> " ,this.profileData);
        this.setFormData();
         this.confirmLoading = false;
      });
    },
    //审核类型
    loadAnchorAuditType(){
      getAnchorAuditType({ digitId:  this.pageParam.digitId }).then((response) => {
        console.log("anchorAuditTypeData==>",response);
         for (var i = 0; i < response.data.length; i++) {
           switch ( response.data[i].type) {
             case 1: //个人资料
                this.auditProfile = response.data[i].status;
                this.auditProfileSerialNumber = response.data[i].serialNumber;
               break;
               case 3: //视频
               this.auditVideo = response.data[i].status;
               this.auditVideoSerialNumber = response.data[i].serialNumber;
               break;
             case 2: //相册
               this.auditPhoto = response.data[i].status;
                this.auditPhotoSerialNumber = response.data[i].serialNumber;
               break;
           }
        }
      });
    },
    auditHandle(pageParam, title) {
      this.shModalT = title;
      this.shModal = true;
    },
    shHandleCancel() {
      this.shModal = false;
      this.desc = "";
    },
    shHandleOk(__id) {
      let postSerialNumber;
      switch (this.shModalT) {
        case '个人资料审核':
          postSerialNumber = this.auditProfileSerialNumber;
          break;
      
        case '相册审核':
          postSerialNumber = this.auditPhotoSerialNumber;
          break;
       case '视频审核':
          postSerialNumber = this.auditVideoSerialNumber;
          break;
      
      }
     console.log("shHandleOk postSerialNumber ==" ,postSerialNumber);
      anchorHandle({
        serialNumber: postSerialNumber,
        operate: __id,
        message: this.desc,
      })
        .then((response) => {
          console.log("anchorHandle response=》",response);
          if (response.success) {
            this.$message.info(response.message);
          } else{
             this.$message.error(response.message);
          }
        })
        .then(() => {
          this.desc = "";
          this.shModal = false;
        });
    },
    setFormData(){
      this.form.resetFields();
      var vobj ={
        // phone: this.pageParam.phone,
        // gender: this.pageParam.gender,
        birthDay: this.profileData.birthDay,
        city: this.profileData.city,
        profession: this.profileData.profession,
        labels:this.profileData.labels,
        intro: this.profileData.intro,
      } 
      let labelsData = '';
      for(var i=0; i < this.profileData.labels.length;i++){
          if(i == this.profileData.labels.length-1){
            labelsData = labelsData+this.profileData.labels[i].name;
          }else{
          labelsData = labelsData+this.profileData.labels[i].name+','
          }
      }
      vobj.labels=labelsData;
      // vobj.birth = moment(vobj.birth).format('YYYY-MM-DD');
      this.form.setFieldsValue(vobj);
      // this.form.setFieldsValue(pick( this.profileData, "birth", "city", "profession" , "intro" ));
    },
    handleEdit() {
      const that = this;
      this.$confirm({
        title: "修改确认",
        content: (h) => (
          <div style="color:#000; font-size:15px;">
            确定要修改资料吗？
          </div>
        ),
        onOk() {
          that.confirmLoading = true

          that.form.validateFields((errors, values) => {
            if (!errors) {
              values.digitId = that.pageParam.digitId;
              // values.birth = that.profileData.birthDay;
              //moment(record.saleStartTime);
             
              console.log("编辑接口 Received values of form: ", values);

              updateUserProfileBase(values).then(response => {
                console.log("编辑接口 updateUserProfileBase: ", response);
                if (response.code === 0) {
                  that.profileData.birthDay = response.data.birthDay;
                  that.profileData.city =  response.data.city;
                  that.profileData.profession =  response.data.profession;
                  that.profileData.labels =  response.data.labels;
                  that.profileData.intro =  response.data.intro;

                  that.$message.info("资料修改成功！");
                  // that.$message.info(response.message);
                  // that.$emit("ok");
                  // that.handleCancel();
                } else {
                  that.$message.error(response.message);
                }
              });
            }
            that.confirmLoading = false
          })
        },
        onCancel() {},
      });
    },

    handleSeal() {
      this.$refs.formHandleSeal.add(this.pageParam.digitId);
    },
   
        
    handleInvite() {
      this.$refs.formHandleInvite.add(this.pageParam.digitId);
    },
    
    chongzhandle () {
      this.drawer01.visible = true
      this.drawer01.title = this.pageParam.nick +'-充值记录'
      this.$nextTick(() => {
        this.$refs.chongzHandle.add(this.pageParam)
      })
    },
    openxiaof(type) {
      let typename ='';
      switch (type) {
        case '0':
           typename = '语音'
          break;
        case '1':
           typename = '视频'
          break;
        case '2':
           typename = '私信'
          break;
        case '3':
           typename = '礼物'
          break;
      }

      this.drawer02.visible = true
      this.drawer02.title = this.pageParam.nick +'-'+typename+'收益记录'
      this.$nextTick(() => {
        this.$refs.xiaofHandle.add(this.pageParam,type);
      })
    },
    fobbiden(row,type){
       this.$refs.formHandleEditDevice.add(row,type)
    }
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
</style>
