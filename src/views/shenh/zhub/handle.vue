<template>
   <a-spin :spinning="confirmLoading" >
    <a-card>
      <a-card-grid class="card-box" style="width: 33%">
        <a-card-meta title="账号信息">
          <template slot="description">
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">用户ID：</a-col>
              <a-col flex="auto">{{ pageParam.digitId }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">头像：</a-col>
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
              <a-col flex="90px">昵称：</a-col>
              <a-col flex="auto">{{ profileData.nick }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">身份：</a-col>
              <a-col flex="auto">{{
                profileData.identity == 0 ? "未认证" : "已认证"
              }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">粉丝数：</a-col>
              <a-col flex="auto">{{ profileData.follows }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">注册时间：</a-col>
              <a-col flex="auto">{{ profileData.createTime }}</a-col>
            </a-row>
          </template>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 33%">
        <a-card-meta title="个人信息">
          <template slot="description">
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">手机号：</a-col>
              <a-col flex="auto">{{ profileData.phone }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">性别：</a-col>
              <a-col flex="auto">{{ profileData.gender |  statusType(genderTypes) }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">年龄：</a-col>
              <a-col flex="auto">{{ profileData.age }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">星座：</a-col>
              <a-col flex="auto">{{ profileData.constellation }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">所在城市：</a-col>
              <a-col flex="auto">{{ profileData.city }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">职业：</a-col>
              <a-col flex="auto">{{ profileData.profession }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">个性标签：</a-col>
              <a-col flex="auto">
                <span v-for="(label, index) in profileData.labels" :key="index">
                  {{ label.name }}
                </span>
              </a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">语音介绍：</a-col>
              <a-col flex="auto"
                ><audio
                  style="width: 200px; height: 50px"
                  ref='shenhaudio'
                  preload="auto"
                  controls
                ></audio
              ></a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">个人签名：</a-col>
              <a-col flex="auto">{{ profileData.intro }}</a-col>
            </a-row>
          </template>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 33%">
        <a-card-meta title="聊天信息">
          <template slot="description">
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">视频收费：</a-col>
              <a-col flex="auto">{{ profileData.videoPrice }}聊币/分钟</a-col>
            </a-row>
             <a-row class="card-box-li" type="flex">
              <a-col flex="90px">视频分成：</a-col>
              <a-col flex="auto">{{ profileData.videoProfitRatio*100 }}%</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">语音收费：</a-col>
              <a-col flex="auto">{{ profileData.callPrice }}聊币/分钟</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">语音分成</a-col>
              <a-col flex="auto">{{ profileData.voiceProfitRatio*100 }}%</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">私聊收费：</a-col>
              <a-col flex="auto">{{ profileData.messagePrice }}聊币/分钟</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">私聊分成：</a-col>
              <a-col flex="auto">{{ profileData.msgProfitRatio*100 }}%</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">礼物分成：</a-col>
              <a-col flex="auto">{{ profileData.giftProfitRatio*100 }}%</a-col>
            </a-row>
          </template>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 33%" v-if="false">
        <a-card-meta title="账户信息">
          <template slot="description">
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">视频收费：</a-col>
              <a-col flex="auto">{{ profileData.videoPrice }}聊币/分钟</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">语音收费：</a-col>
              <a-col flex="auto">{{ profileData.callPrice }}聊币/分钟</a-col>
            </a-row>
          </template>
        </a-card-meta>
      </a-card-grid>
    </a-card>
    <div class="card-sh">
      审核结果：<span :class="[ auditProfile == '30' ? 'fnt-success': 'fnt-error']">{{ auditProfile | statusType(anchorStatus) }}</span>
      <a-button type="danger" v-if="auditProfile==10 ?true:false" @click="auditHandle(pageParam, '个人资料审核')"
        >审核</a-button
      >
    </div>

    <a-card style="margin-top: 10px">
      <a-card-grid class="card-box" style="width: 20%">
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
                  :size="60"
                  :src="photoUrl"
                  @click="openBigImg(photoUrl)"
              />
                </div></a-col>
            </a-row>
            <div class="card-sh" style="border: 0; padding-left: 0">
              审核结果：<span :class="[ auditPhoto == '30' ? 'fnt-success': 'fnt-error']">{{ auditPhoto | statusType(anchorStatus) }}</span>
              <a-button type="danger"  v-if=" auditPhoto == 10 ? true : false"  @click="auditHandle(pageParam, '相册审核')"
                >审核</a-button
              >
            </div>
          </template>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 20%">
        <a-card-meta title="TA的视频">
          <template slot="description">
            <div  v-if="profileData.videoUrl == null ? false : true" class="video-box" @click="openBigVideo(0)">
              <div class="video-open"></div>
              <video
                class="video-box"
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
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 20%">
        <a-card-meta title="TA的认证视频">
          <template slot="description">
            <div class="video-box" @click="openBigVideo(1)"  v-if="profileData.videoAuditUrl==null?false:true">
              <div class="video-open"></div>
              <video 
                class="video-box"
                style="width: 50%"
                controls="false"
                enable-progress-gesture="false"
                show-center-play-btn="false"
                :src="profileData.videoAuditUrl"
              ></video>
            </div>

            
            <div class="card-sh" style="border: 0; padding-left: 0">
              审核结果：<span :class="[ auditVideoRZ == '30' ? 'fnt-success': 'fnt-error']">{{auditVideoRZ | statusType(anchorStatus)}}</span>
              <a-button type="danger"   v-if=" auditVideoRZ == 10 ? true : false"  @click="auditHandle(pageParam, '认证视频审核')"
                >审核</a-button>

              <!-- <a-button type="danger"  v-if=" auditVideoRZ == 10 ? true : false"  @click="auditHandle(pageParam, '认证视频审核')"
                >审核</a-button> -->
            </div>
          </template>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 20%">
        <a-card-meta title="TA的守护照片">
          <template slot="description">
            <a-row :gutter="[10, { xs: 8, sm: 16, md: 5, lg: 10 }]">
              <a-col
                :span="8"
                v-for="(photoUrl, index) in profileData.thumbnailGuardPhotosUrlList"
                :key="index"
                @click="openBigImg(profileData.guardPhotosUrlList[index])"
              >
                <div class="photo-li">
                  <a-avatar
                  shape="square"
                  :size="60"
                  :src="photoUrl"
                  @click="openBigImg(photoUrl)"
              />
                </div></a-col>
            </a-row>
            <div class="card-sh" style="border: 0; padding-left: 0">
              审核结果：<span :class="[ auditPhotoSH == '30' ? 'fnt-success': 'fnt-error']">{{ auditPhotoSH | statusType(anchorStatus) }}</span>
              <a-button type="danger"  v-if=" auditPhotoSH == 10 ? true : false"  @click="auditHandle(pageParam, '守护照片审核')"
                >审核</a-button
              >
            </div>
          </template>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 20%" v-if="false">
        <a-card-meta title="TA的守护视频">
          <template slot="description">
            <div class="video-box" @click="openBigVideo(2)">
              <div class="video-open"></div>
              <video v-if="profileData.videoAuditUrl==null?false:true"
                class="video-box"
                style="width: 50%"
                controls="false"
                enable-progress-gesture="false"
                show-center-play-btn="false"
                ref="shenhvideoSH"
              ></video>
            </div>
            
            <div class="card-sh" style="border: 0; padding-left: 0">
              审核结果：<span :class="[ auditVideoSH == '30' ? 'fnt-success': 'fnt-error']">{{auditVideoSH | statusType(anchorStatus)}}</span>
              <a-button type="danger"  v-if=" auditVideoSH == 10 ? true : false"  @click="auditHandle(pageParam, '守护视频审核')"
                >审核</a-button
              >
            </div>
          </template>
        </a-card-meta>
      </a-card-grid>

    </a-card>

    <a-modal
      title=""
      :visible="imgModal"
      :confirm-loading="false"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-button style="position: absolute;left: 50%;transform: translateX(-50%);" type="primary"   @click="setCover()">设置为封面</a-button>
      <a-input  type="file" id="fileLoad" multiple="multiple"  name="file" style="display:none"/>
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
        ref="shenhvideo2"
        style="width: 100%"
        controls="false"
        enable-progress-gesture="false"
        show-center-play-btn="false"
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
    </a-spin>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import { anchorHandle, getProfileAudit ,getAnchorAuditType,achorVideoAudit,updatePhotos,updateUserMaterials} from "@/api/system/userManager";
import { STable } from "@/components";
import {
  getAnchorCall,
  getAnchorGift,
  getAnchorMsg,
  getConsumerCall,
  getConsumerGift,
  getConsumerMsg,
} from "@/api/system/profitManager";
import { withdrawHandle } from "@/api/system/withdrawManager";
import {  dataTypes ,genderTypes ,anchorStatus } from "@/config/serverstatus";
import InputType from '../../../components/InputType/InputType.vue';

export default {
  name: "tixsh",
  components: {InputType},
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      confirmLoading: false,
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
      auditPhotoSH:'-1',
      auditVideo:'-1',
      auditVideoRZ:'-1',
      auditVideoSH:'-1',
      auditProfileSerialNumber :'-1',
      auditPhotoSerialNumber:'-1',
      auditPhotoSHSerialNumber:'-1',
      auditVideoSerialNumber:'-1',
      auditVideoRZSerialNumber:'-1',
      auditVideoSHSerialNumber:'-1',
    };
  },
  created() {
         this.confirmLoading = true;
         
  },
   filters: {
    statusType(__value, __status) {
      return __status[__value];
    },
  },
  methods: {
    edit(record){
      this.pageParam = record;
      console.log("主播审核详情列表信息==>", this.pageParam);
      // pageData.digitId='16422001';
      this.$nextTick(()=>{
        this.loadProfileData();
        this.loadAnchorAuditType();
      });
    },
    openBigVideo(type) {
      // if(this.profileData.videoUrl == null)return;
      this.videoModal = true;
       setTimeout(() => {
          switch ( type) {
             case 0: //视频
                this.$refs.shenhvideo2.src = this.profileData.videoUrl;
               break;
               case 1: //认证视频
               this.$refs.shenhvideo2.src = this.profileData.videoAuditUrl;
               break;
             case 2: //守护视频
              this.$refs.shenhvideo2.src = this.profileData.videoAuditUrl;
               break;
           }
            
      }, 50)
      
    },
    openBigImg(__url) {
      this.imgModalUrl = __url;
      this.imgModal = true;
    },
    handleCancel(e) {
      this.imgModal = false;
      this.videoModal = false;
    },
    withdrawClick(__operate) {
      if (
        typeof this.queryParam.message == "undefined" ||
        this.queryParam.message == null ||
        this.queryParam.message == ""
      ) {
        this.$message.info("请填写备注信息");
        return;
      }

      let otherParam = { operate: __operate };
      withdrawHandle(Object.assign(otherParam, this.queryParam)).then((response) => {
        if (response.success) {
          this.$message.success("操作成功");
          this.handleOk = response.success;
        }
      });
    },
    //个人信息
    loadProfileData() {
      this.profileData={};
      getProfileAudit({ digitId: this.pageParam.digitId }).then((response) => {
        this.profileData = response.data;

        console.log( response.data.photoThumbnailUrlList[0])
      //  console.log(this.$refs);
      //  console.log("主播审核 getProfileAudit profileData ==> " ,this.profileData);
        if(this.$refs.shenhaudio) this.$refs.shenhaudio.src = this.profileData.voiceUrl;
        // if(this.$refs.shenhvideo) this.$refs.shenhvideo.src = this.profileData.videoUrl;
        // if(this.$refs.shenhvideoRZ  )this.$refs.shenhvideoRZ.src = this.profileData.videoAuditUrl;
        // this.$refs.shenhvideoSH.src = this.profileData.videoAuditUrl;
        
      });
    },
    //审核类型
    loadAnchorAuditType(){
      getAnchorAuditType({ digitId: this.pageParam.digitId }).then((response) => {
        console.log("anchorAuditTypeData 审核类型==>",response);
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
             case 4: //守护相册
               this.auditPhotoSH = response.data[i].status;
                this.auditPhotoSHSerialNumber = response.data[i].serialNumber;
               break;
            case 5: //守护视频
               this.auditVideoSH = response.data[i].status;
                this.auditVideoSHSerialNumber = response.data[i].serialNumber;
               break;
            case 6: //认证视频
               this.auditVideoRZ = response.data[i].status;
                this.auditVideoRZSerialNumber = response.data[i].serialNumber;
               break;
           
           }
        }
        this.confirmLoading = false;
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
        case '认证视频审核':
          postSerialNumber = this.auditVideoRZSerialNumber;
          break;
        case '守护照片审核':
          postSerialNumber = this.auditPhotoSHSerialNumber;
          break;
        case '守护视频审核':
          postSerialNumber = this.auditVideoSHSerialNumber;
          break;
      }
     console.log("shHandleOk postSerialNumber ==" ,postSerialNumber);
        anchorHandle({
          serialNumber: postSerialNumber,
          operate: __id,
          message: this.desc,
        })
          .then((response) => {
            console.log("anchorHandle type==?",this.shModalT, " >response=》",response);
            if (response.success) {
              this.$message.info(response.message);
            } else{
              this.$message.error(response.message);
            }
          })
          .then(() => {
            this.desc = "";
            this.shModal = false;
            this.loadAnchorAuditType();
          });

        // }





    },
    //设置照片封面（照片第一张）
    setCover(){


      
       var formData = new FormData(); 
         updateUserMaterials({
          serialNumber: this.auditPhotoSerialNumber,
         coverName: this.imgModalUrl,
          digitId: this.profileData.digitId,
        })
          .then((response) => {
            if (response.success) {
             // this.loadProfileData();
               this.profileData = response.data;
               this.profileData.photoUrlList=response.data.photoUrlList
                this.profileData.photoThumbnailUrlList=response.data.photoThumbnailUrlList
                console.log(response.data.photoThumbnailUrlList[0])
                this.imgModal=false;
            } else{
              this.$message.error(response.message);
            }
          })
          .then(() => {
            this.desc = "";
            this.imgModal = false;
           // this.loadProfileData();
          });
      
    },
    
  },
};
</script>
<style lang="less" scoped>
.card-box {
  box-shadow: none !important;
  &-li {
    padding: 3px 0;
    .ant-col:last-child {
      color: #000;
      font-weight: bold;
    }
  }
}
.card-sh {
  background: #fff;
  padding: 10px;
  border: 1px solid #e8e8e8;
  border-top: 0;
  .ant-btn {
    margin-left: 15px;
  }
}
.photo-li {
  width: 100%;
  position: relative;
  .photo-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .video-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
  }
}
.tk-table {
  margin-top: 10px;
}
.shenh-handle {
  border: 1px solid #eee;
  boder-top: 0;
  margin-top: -1px;
  border-bottom: 0;
  padding: 20px;
  background: #fff;
}
.shenh-handle2 {
  border: 0;
  margin: 0;
  padding: 20px 0;
}
.shenh-handle span {
  padding: 0 10px;
}
.video-box {
  position: relative;
}
.video-open {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
