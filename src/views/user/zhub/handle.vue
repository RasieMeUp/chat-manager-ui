<template>
  <a-spin :spinning="confirmLoading">
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
                <a-col flex="auto">
                  <a-avatar
                    shape="square"
                    :size="64"
                    icon="user"
                    :src="profileData.headThumbnailUrl"
                    @click="openBigImg(profileData.headUrl)"
                  />
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">昵称：</a-col>
                <a-col flex="auto">
                  <a-form-item>
                    <a-input
                      v-decorator="['nick', {rules: [{required: true, min: 1, message: '请输入账号名称！'}]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">粉丝数：</a-col>
                <a-col flex="auto">{{ profileData.follows | isEmpty(true) }}</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">注册时间：</a-col>
                <a-col flex="auto">{{ pageParam.createTime | isEmpty(true) }}</a-col>
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
                  {{ pageParam.phone  | isEmpty(true) }}
                  <!-- <a-form-item>
                    <a-input
                      v-decorator="['phone', {rules: [{required: true, min: 11, message: '请输入手机号'}]}]"
                    />
                  </a-form-item> -->
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">性别：</a-col>
                <a-col flex="auto">
                   {{ profileData.gender |  statusType(genderTypes) }}
                  <!-- <a-form-item>
                    <a-select
                      v-decorator="['gender', {rules: [{required: true,  message: '请选择性别'}]}]"
                    >
                      <a-select-option :value="0">女</a-select-option>
                      <a-select-option :value="1">男</a-select-option>
                    </a-select>
                  </a-form-item> -->
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">生日</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.birth}} -->
                  <a-form-item>
                    <a-input
                      v-decorator="['birthDay', {rules: [{ message: '请输入生日'}]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <!-- <a-row class="card-box-li" type="flex">
                <a-col flex="70px">年龄：</a-col>
                <a-col flex="auto">{{ profileData.age }}</a-col>
              </a-row>-->
              <!-- <a-row class="card-box-li" type="flex">
                <a-col flex="70px">星座：</a-col>
                <a-col flex="auto">{{ profileData.constellation }}</a-col>
              </a-row>-->
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">所在城市：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.city }} -->
                  <a-form-item>
                    <a-input
                      v-decorator="['city', {rules: [{message: '请输入所在城市'}]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">职业：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.profession }} -->
                  <a-form-item>
                    <a-input
                      v-decorator="['profession', {rules: [{message: '请输入职业'}]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">个性标签：</a-col>
                <a-col flex="auto">
                  <!-- <span v-for="(label, index) in profileData.labels" :key="index">{{ label.name }}</span> -->
                  <a-form-item>
                    <a-input
                      v-decorator="['labels', {rules: [{message: '请输入个性标签'}]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">语音介绍：</a-col>
                <a-col flex="auto">
                  <audio
                    style="width: 200px; height: 50px"
                    :src="profileData.voiceUrl"
                    preload="auto"
                    controls
                  ></audio>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">个人签名：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.intro }} -->
                  <a-form-item>
                    <a-input
                      v-decorator="['intro', {rules: [{ min: 3, message: '请输入个人签名'}]}]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </template>
          </a-card-meta>
        </a-card-grid>
        <a-card-grid class="card-box" style="width: 25%">
          <a-card-meta title="聊天信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">视频收费：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.callPrice }}聊币/分钟 -->
                  <a-form-item>
                    <a-select
                      v-decorator="['videoPrice']"
                    >
                      <a-select-option :value="i" v-for="i in videoPrice" :key="i">{{ i }}聊币/1分钟</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">视频分成：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.videoProfitRatio*100 | isEmpty(false)  }}% -->
                  <!-- <a-form-item>
                    <a-input
                      v-decorator="['videoProfitRatio']"
                    />
                  </a-form-item> -->
                  <a-form-item>
                    <a-select v-model="videoProfitRatio"
                      v-decorator="['videoProfitRatio']"
                    >
                     <!-- <a-select-option value="" key="">  </a-select-option> -->
<a-select-option :value="i.value" v-for="i in videoPriceScope"  :key="i">{{ i.name }}</a-select-option>
                      <!--  -->
                    <!-- <a-select-option :value="0.3">30%</a-select-option>
                      <a-select-option :value="0.35">35%</a-select-option>
                      <a-select-option :value="0.4">40%</a-select-option>
                      <a-select-option :value="0.45">45%</a-select-option>
                      <a-select-option :value="0.5">50%</a-select-option>
                      <a-select-option :value="0.55">55%</a-select-option>
                      <a-select-option :value="0.6">60%</a-select-option>
                      <a-select-option :value="0.65">65%</a-select-option>
                      <a-select-option :value="0.7">70%</a-select-option>
                      <a-select-option :value="0.75">75%</a-select-option> 
                      <a-select-option :value="0.8">80%</a-select-option> -->
                    </a-select>
                  </a-form-item>

                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">语音收费：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.videoPrice }}聊币/分钟 -->
                  <a-form-item>
                    <a-select
                      v-decorator="['callPrice']"
                    >
                      <a-select-option :value="i" v-for="i in voicePrice" :key="i">{{ i }}聊币/1分钟</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">语音分成：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.voiceProfitRatio*100 | isEmpty(false) }}% -->
                  <!-- <a-form-item>
                    <a-input
                      v-decorator="['voiceProfitRatio']"
                    />
                  </a-form-item> -->
                  <a-form-item>
                    <a-select
                      v-decorator="['voiceProfitRatio']"
                    >
                      <!-- <a-select-option :value="i.value" v-for="i in videoProfitRatioValue">{{ i.name }}%</a-select-option> -->
                       <a-select-option :value="0.3">30%</a-select-option>
                       <a-select-option :value="0.35">35%</a-select-option>
                      <a-select-option :value="0.4">40%</a-select-option>
                      <a-select-option :value="0.45">45%</a-select-option>
                      <a-select-option :value="0.5">50%</a-select-option>
                      <a-select-option :value="0.55">55%</a-select-option>
                      <a-select-option :value="0.6">60%</a-select-option>
                      <a-select-option :value="0.65">65%</a-select-option>
                      <a-select-option :value="0.7">70%</a-select-option>
                      <a-select-option :value="0.75">75%</a-select-option>
                      <a-select-option :value="0.8">80%</a-select-option>
                    </a-select>
                  </a-form-item>

                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">私聊收费：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.messagePrice }}聊币/分钟 -->
                  <a-form-item>
                    <a-select
                      v-decorator="['messagePrice']"
                    >
                      <a-select-option :value="i" v-for="i in msgPrice" :key="i">{{ i }}聊币/1条</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">私聊分成：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.msgProfitRatio*100 | isEmpty(false) }}% -->
                  <!-- <a-form-item>
                    <a-input
                      v-decorator="['msgProfitRatio']"
                    />
                  </a-form-item> -->

                  <a-form-item>
                    <a-select
                      v-decorator="['msgProfitRatio']"
                    >
                      <!-- <a-select-option :value="i.value" v-for="i in videoProfitRatioValue">{{ i.name }}%</a-select-option> -->
                      <a-select-option :value="0.4">40%</a-select-option>
                      <a-select-option :value="0.5">50%</a-select-option>
                      <!-- <a-select-option :value="0.65">65%</a-select-option>
                      <a-select-option :value="0.7">70%</a-select-option>
                      <a-select-option :value="0.75">75%</a-select-option>
                      <a-select-option :value="0.8">80%</a-select-option> -->
                    </a-select>
                  </a-form-item>

                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">礼物分成：</a-col>
                <a-col flex="auto">
                  <!-- {{ profileData.giftProfitRatio*100 | isEmpty(false) }}% -->
                  <!-- <a-form-item>
                    <a-input
                      v-decorator="['giftProfitRatio']"
                    />
                  </a-form-item> -->

                <a-form-item>
                    <a-select
                      v-decorator="['giftProfitRatio']"
                    >
                      <!-- <a-select-option :value="i.value" v-for="i in videoProfitRatioValue">{{ i.name }}%</a-select-option> -->
                      <a-select-option :value="0.35">35%</a-select-option>
                      <a-select-option :value="0.4">40%</a-select-option>
                      <a-select-option :value="0.45">45%</a-select-option>
                      <a-select-option :value="0.5">50%</a-select-option>
                      <a-select-option :value="0.55">55%</a-select-option>
                      <!-- <a-select-option :value="0.6">60%</a-select-option>
                      <a-select-option :value="0.65">65%</a-select-option>
                      <a-select-option :value="0.7">70%</a-select-option>
                      <a-select-option :value="0.75">75%</a-select-option>
                      <a-select-option :value="0.8">80%</a-select-option> -->
                    </a-select>
                  </a-form-item>


                </a-col>
              </a-row>

              <a-row class="card-box-li" type="flex" style="margin-top:10px;">
                <a-col flex="70px">视频时长：</a-col>
                <a-col flex="auto">{{ pageParam.videoDuration | secondToDate(false) }}</a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">视频收益：</a-col>
                <a-col flex="auto">
                  {{ pageParam.videoProfit | isEmpty(false) }}聊币
                  <a-tag @click="openZhubsy('1')" v-has="{perm:'cwfb:edit'}">查看更多</a-tag>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">语音时长：</a-col>
                <a-col flex="auto">{{ pageParam.audioDuration | secondToDate(false) }} </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px">语音收益：</a-col>
                <a-col flex="auto">
                  {{ pageParam.audioProfit | isEmpty(false) }}聊币
                  <a-tag @click="openZhubsy('0')" v-has="{perm:'cwfb:edit'}">查看更多</a-tag>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">私信收益：</a-col>
                <a-col flex="auto">
                  {{ pageParam.messageProfit | isEmpty(false) }}聊币
                  <a-tag @click="openZhubsy('2')" v-has="{perm:'cwfb:edit'}">查看更多</a-tag>
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex" style="margin-top:8px;">
                <a-col flex="70px">礼物收益：</a-col>
                <a-col flex="auto">
                  {{ pageParam.giftProfit | isEmpty(false) }}聊币
                  <a-tag @click="openZhubsy('3')" v-has="{perm:'cwfb:edit'}">查看更多</a-tag>
                </a-col>
              </a-row>
            </template>
          </a-card-meta>
        </a-card-grid>
        <a-card-grid class="card-box" style="width: 25%">
          <a-card-meta title="账户信息">
            <template slot="description">
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px" style="color:#f00">提现金额:</a-col>
                <a-col flex="auto" style="color:#f00">
                  无字段…… 聊币/分钟
                  <a-tag @click="tixhandle()">提现记录</a-tag>
                  <!-- <a-menu class="content-link">
                    <a-menu-item key="/chongztxManager/tix/index" v-has="{ perm: 'role:delete' }">
                      <router-link :to="{ name: 'tixList', params: {} }">
                        提现记录
                      </router-link>
                    </a-menu-item>
                  </a-menu>-->
                </a-col>
              </a-row>
              <a-row class="card-box-li" type="flex">
                <a-col flex="70px" style="color:#f00">账户余额：</a-col>
                <a-col flex="auto" style="color:#f00">{{ pageParam.coin | isEmpty(false) }}聊币/分钟</a-col>
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
    </div>-->

    <a-card style="margin-top: 15px">
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
                </div>
              </a-col>
            </a-row>

          </template>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 20%">
        <a-card-meta title="TA的视频">
          <template slot="description">
            <div  v-if="profileData.videoUrl==null?false:true" class="video-box" @click="openBigVideo(0)">
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

           
          </template>
        </a-card-meta>
      </a-card-grid>

  <a-card-grid class="card-box" style="width: 20%">
        <a-card-meta title="TA的认证视频">
          <template slot="description">
            <div  v-if="profileData.videoAuditUrl==null?false:true" class="video-box"  @click="openBigVideo(1)">
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
                </div>
              </a-col>
            </a-row>

          </template>
        </a-card-meta>
      </a-card-grid>

  <a-card-grid class="card-box" style="width: 20%" v-if="false">
        <a-card-meta title="TA的守护视频">
          <template slot="description">
            <div  v-if="profileData.videoAuditUrl==null?false:true"  class="video-box" @click="openBigVideo(2)">
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

           
          </template>
        </a-card-meta>
      </a-card-grid>




    </a-card>

   
    <a-modal
      title
      :visible="imgModal"
      :confirm-loading="false"
      :footer="null"
      @cancel="handleCancel"
    >
          <a-button style="position: absolute;left: 50%;transform: translateX(-50%);" type="primary"   @click="setCover()">设置为封面</a-button>

      <p>
        <img class="photo-img" :src="imgModalUrl" style="width: 100%" />
      </p>
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
      备注：
      <a-input v-model="desc" type="textarea" placeholder="请填写备注信息" />
      <div style="text-align: center; padding: 30px 0 0 0">
        <a-button type="primary" size="large" @click="shHandleOk(1)" style="margin-right: 50px">审核通过</a-button>
        <a-button type="danger" size="large" @click="shHandleOk(0)">审核不通过</a-button>
      </div>
    </a-modal>

    <form-handle ref="formHandle" @ok="handleOk" />
    <form-handle-seal ref="formHandleSeal" @ok="handleOk" />
    <form-handle-invite ref="formHandleInvite" @ok="handleOk" />

    <a-drawer
      :title="drawer01.title"
      :width="drawer01.width"
      :maskClosable="false"
      :visible="drawer01.visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=>{drawer01.visible=false}"
    >
      <tixList-handle ref="tixListHandle" @ok="handleOk" />
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
      <zhubsy-handle ref="zhubsyHandle" @ok="handleOk" />
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

    <!-- <a-menu class="content-link">
                    <a-menu-item key="/chongztxManager/tix/index" v-has="{ perm: 'role:delete' }">
                      <router-link :to="{ name: 'tixList', params: {} }">
                        提现记录
                      </router-link>
                    </a-menu-item>
    </a-menu>-->
  </a-spin>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import formHandle from "./recommend";
import formHandleSeal from "./seal";
import formHandleInvite from "./invite";
import tixListHandle from "@/views/chongztx/tix/index";
import zhubsyHandle from "@/views/userxf/zhubsy/index";
import pick from "lodash.pick";
import {
  anchorHandle,
  getProfile,
  getAnchorAuditType
} from "@/api/system/userManager";
import { getProfitPrice } from "@/api/system/common";
import { getPriceConfig } from "@/api/system/management/paramter";
import { STable } from "@/components";
import {
  getAnchorCall,
  getAnchorGift,
  getAnchorMsg,
  getConsumerCall,
  getConsumerGift,
  getConsumerMsg
} from "@/api/system/profitManager";
import { updateUserProfileBase,updateUserMaterials } from "@/api/system/userManager";
import { dataTypes, genderTypes, anchorStatus } from "@/config/serverstatus";

export default {
  name: "zhubDetail",
  components: {
    STable,
    formHandle,
    formHandleSeal,
    formHandleInvite,
    tixListHandle,
    zhubsyHandle
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      drawer01: {
        visible: false,
        title: "提现记录"
      },
      drawer02: {
        visible: false,
        title: "收益记录"
      },
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
        sm: { span: "100px" }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
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


      form: this.$form.createForm(this),
      confirmLoading: false,
      msgPrice: [],
      videoPrice: [],
      voicePrice: [],
      videoPrice:[],
      videoPriceScope:[{
        name:"",
        value:"",
      }],
      msgPriceScope:[],
      giftPriceScope:[],
    };
  },
  created() {
    this.confirmLoading = true;
  },
  filters: {
    statusType(__value, __status) {
      return __status[__value];
    },
    isEmpty(__value, __type) {
      if (__value !== null && typeof __value !== "undefined") return __value;
      if (__type) {
        return "-";
      } else {
        return "0";
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
    edit(record) {
      this.pageParam = record;
      console.log("主播列表信息==>", this.pageParam);
      this.$nextTick(() => {
         this.loadPriceScope();
        this.loadProfileData();
        this.loadAnchorAuditType();
        //获取收费区间
        this.loadProfitPrice();
       
      });
    },
    openBigVideo(type) {
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
    //个人信息
    loadProfileData() {
      this.profileData = {};
      getProfile({ digitId: this.pageParam.digitId }).then(response => {
        this.profileData = response.data;
        console.log("主播详情 profileData ==> ", this.profileData);
        this.setFormData();
        this.confirmLoading = false;
      });
    },
    //审核类型
    loadAnchorAuditType() {
      getAnchorAuditType({ digitId: this.pageParam.digitId }).then(response => {
        console.log("anchorAuditTypeData==>", response);
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
      });
    },
    //获取收费区间
    loadProfitPrice() {
      getProfitPrice().then(response => {
        console.log("获取收费区间 ==> ", response);
        if (response.code === 0) {
          this.msgPrice = response.data.msgPrice;
          this.videoPrice = response.data.videoPrice;
          this.voicePrice = response.data.voicePrice;

          console.log(this.videoPrice, this.voicePrice, this.msgPrice);
        } else {
          this.$message.error(response.message);
        }
      });
    },

    loadPriceScope(){
      getPriceConfig().then(response => {
       // this.videoPriceScope=
       this.videoPriceScope.splice(0, this.videoPriceScope.length);
        if (response.code === 0) {
          var vocieScope=response.data.videoPriceScope.split(",")
          // this.msgPrice = response.data.msgPriceScope;
          //  this.videoPriceScope = response.data.videoPriceScope;
          // this.voicePriceScope = response.data.voicePriceScope;
          // this.giftPriceScope = response.data.giftPriceScope;
          for(var i=0;i<vocieScope.length;i++){
              var name=vocieScope[i];
              var value = (name.split("%")[0])/100;        
               this.videoPriceScope.push({name: vocieScope[i], value: value});
          }
          //语音，私信，礼物分成同上
        } else {
          this.$message.error(response.message);
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

      // if(this.shModalT=="认证视频审核"){
      //   achorVideoAudit({
      //     digitId: this.pageParam.digitId,
      //     serialNumber: postSerialNumber,
      //     operate: __id,
      //     message: this.desc,
      //   })
      //     .then((response) => {
      //       console.log("anchorHandle 认证视频审核=》",response);
      //       if (response.success) {
      //         this.$message.info(response.message);
      //       } else{
      //         this.$message.error(response.message);
      //       }
      //     })
      //     .then(() => {
      //       this.desc = "";
      //       this.shModal = false;
      //       this.loadAnchorAuditType();
      //     });



      // }else{


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
    setFormData() {
      this.form.resetFields();
      var vobj = {
        nick: this.pageParam.nick,
        // phone: this.pageParam.phone,
        // gender: this.pageParam.gender,
        birthDay: this.profileData.birthDay,
        city: this.profileData.city,
        profession: this.profileData.profession,
        labels: this.profileData.labels,
        intro: this.profileData.intro,

        videoProfitRatio: this.profileData.videoProfitRatio ,
        voiceProfitRatio: this.profileData.voiceProfitRatio,
        msgProfitRatio: this.profileData.msgProfitRatio ,
        giftProfitRatio: this.profileData.giftProfitRatio ,

        callPrice: this.profileData.callPrice,
        videoPrice: this.profileData.videoPrice,
        messagePrice: this.profileData.messagePrice
      };
      let labelsData = "";
      for (var i = 0; i < this.profileData.labels.length; i++) {
        if (i == this.profileData.labels.length - 1) {
          labelsData = labelsData + this.profileData.labels[i].name;
        } else {
          labelsData = labelsData + this.profileData.labels[i].name + ",";
        }
      }
      vobj.labels = labelsData;
      this.form.setFieldsValue(vobj);
      // this.form.setFieldsValue(pick( this.profileData, "birth", "city", "profession" , "intro" ));
    },
    handleEdit() {
      const that = this;
      this.$confirm({
        title: "修改确认",
        content: h => (
          <div style="color:#000; font-size:15px;">确定要修改资料吗？</div>
        ),
        onOk() {
          that.confirmLoading = true;
          that.form.validateFields((errors, values) => {
            if (!errors) {
              


              if(values.nick ==  that.pageParam.nick){
                delete values.nick
              }

              values.digitId = that.pageParam.digitId;
              values.videoProfitRatio = Number(values.videoProfitRatio) ;
              values.voiceProfitRatio =  Number(values.voiceProfitRatio) ;
              values.msgProfitRatio =  Number(values.msgProfitRatio) ;
              values.giftProfitRatio =  Number(values.giftProfitRatio) ;
              console.log("编辑接口 Received values of form: ", values, that.profileData);


              updateUserProfileBase(values).then(response => {
                console.log("编辑接口 updateUserProfileBase: ", response);
                if (response.code === 0) {
                  that.$message.info("资料修改成功！");
                  // that.$emit("ok");

                      that.pageParam.nick = response.data.nick;
                      // that.pageParam.phone= response.data.phone;
                      // that.pageParam.gender= response.data.gender;
                      that.profileData.birthDay = response.data.birthDay;
                      that.profileData.city= response.data.city;
                      that.profileData.profession= response.data.profession;
                      that.profileData.labels= response.data.labels;
                      that.profileData.intro= response.data.intro;

                      that.profileData.videoProfitRatio= response.data.videoProfitRatio;
                      that.profileData.voiceProfitRatio = response.data.voiceProfitRatio;
                      that.profileData.msgProfitRatio= response.data.msgProfitRatio;
                      that.profileData.giftProfitRatio = response.data.giftProfitRatio;

                      that.profileData.callPrice= response.data.callPrice;
                      that.profileData.videoPrice= response.data.videoPrice;
                      that.profileData.messagePrice= response.data.messagePrice;



                  // that.handleCancel();
                } else {
                  that.$message.error(response.message);
                }
              });
            }
            that.confirmLoading = false;
          });
        },
        onCancel() {}
      });
    },
    handleRecommend() {
      this.$refs.formHandle.add(this.pageParam.digitId);
    },
    handleInvite() {
      this.$refs.formHandleInvite.add(this.pageParam.digitId);
    },
    handleSeal() {
      this.$refs.formHandleSeal.add(this.pageParam.digitId);
    },
    tixhandle() {
      this.drawer01.visible = true;
      this.drawer01.title = this.pageParam.nick + "-提现记录";
      this.$nextTick(() => {
        this.$refs.tixListHandle.add(this.pageParam);
      });
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
    openZhubsy(type) {
      let typename = "";
      switch (type) {
        case "0":
          typename = "语音";
          break;
        case "1":
          typename = "视频";
          break;
        case "2":
          typename = "私信";
          break;
        case "3":
          typename = "礼物";
          break;
      }

      this.drawer02.visible = true;
      this.drawer02.title = this.pageParam.nick + "-" + typename + "收益记录";
      this.$nextTick(() => {
        this.$refs.zhubsyHandle.add(this.pageParam, type, 1);
      });
    }
  }
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
  padding-bottom: 0;
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
.ant-form-item {
  margin-bottom: 0;
}
.ant-row-flex {
  align-items: center;
}
.card-box-li {
  padding: 1px 0;
}
</style>
