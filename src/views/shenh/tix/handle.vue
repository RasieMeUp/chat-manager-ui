<template>
   <a-spin :spinning="confirmLoading" >
    <a-card>
      <a-card-grid class="card-box" style="width: 30%">
        <a-card-meta title="账号信息">
          <template slot="description">
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">用户ID：</a-col>
              <a-col flex="auto">{{ pageParam.digitId | isEmpty(true)  }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">昵称：</a-col>
              <a-col flex="auto">{{ pageParam.nick | isEmpty(true)  }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">身份：</a-col>
              <a-col flex="auto">{{
                 profileData.identity == null ? "无" : profileData.identity == 0 ? "未认证" : "已认证"
              }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">粉丝数：</a-col>
              <a-col flex="auto">{{ profileData.follows | isEmpty(false)  }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">注册时间：</a-col>
              <a-col flex="auto">{{ pageParam.createTime | isEmpty(true)  }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">账户余额：</a-col>
              <a-col flex="auto">{{ profileData.coin | isEmpty(false)  }}聊币</a-col>
            </a-row>
          </template>
        </a-card-meta>

        <a-card-meta title="提现信息" style="margin-top: 50px">
          <template slot="description">
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">可提现金额：</a-col>
              <a-col flex="auto">{{ pageParam.drawMax | isEmpty(false)  }}元</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">申请金额：</a-col>
              <a-col flex="auto">{{ pageParam.drawCurr | isEmpty(false)  }}元</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">手续费：</a-col>
              <a-col flex="auto">{{ pageParam.fee | isEmpty(false)  }}</a-col>
            </a-row>
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">提现金额：</a-col>
              <a-col flex="auto"
                ><span class="fnt-error">{{ pageParam.drawActual | isEmpty(false)  }}元</span></a-col
              >
            </a-row>
          </template>
        </a-card-meta>
      </a-card-grid>
      <a-card-grid class="card-box" style="width: 60%">
        <a-card-meta title="近10笔收益记录">
          <template slot="description">
            <a-row class="card-box-li" type="flex">
              <a-col flex="90px">账户余额：</a-col>
              <a-col flex="auto">{{ profileData.coin | isEmpty(false)  }}聊币</a-col>
            </a-row>
            <div class="tixsh-table">
              <a-tabs type="card">
                <a-tab-pane class="tixsh-pane" key="1" tab="视频">
                  <a-table
                    :columns="videoColumns"
                    :row-key="
                      (record, index) => {
                        return index;
                      }
                    "
                    :data-source="anchorVideoData"
                    :pagination="false"
                    bordered
                  >
                   <span slot="type" slot-scope="type">
                      <template>
                       视频
                      </template>
                    </span>

                     <span slot="duration" slot-scope="duration">
                      <template>
                        {{ duration | secondToDate(false) }}
                      </template>
                    </span>
                    <span slot="profit" slot-scope="profit">
                      <template>
                        {{ profit | isEmpty(false) }}
                      </template>
                    </span>
                  </a-table>
                </a-tab-pane>
                <a-tab-pane class="tixsh-pane" key="2" tab="语音">
                  <a-table
                    :columns="videoColumns"
                    :row-key="
                      (record, index) => {
                        return index;
                      }
                    "
                    :data-source="anchorAudioData"
                    :pagination="false"
                    bordered
                  >
                   <span slot="type" slot-scope="type">
                      <template>
                       语音
                      </template>
                    </span>
                    <span slot="duration" slot-scope="duration">
                      <template>
                        {{ duration | secondToDate(false) }}
                      </template>
                    </span>
                    <span slot="profit" slot-scope="profit">
                      <template>
                        {{ profit | isEmpty(false) }}
                      </template>
                    </span>
                  </a-table>
                </a-tab-pane>
                <a-tab-pane class="tixsh-pane" key="3" tab="私信">
                  <a-table
                    :columns="videoColumns"
                    :row-key="
                      (record, index) => {
                        return index;
                      }
                    "
                    :data-source="anchorMsgData"
                    :pagination="false"
                    bordered
                  >
                   <span slot="type" slot-scope="type">
                      <template>
                       私信
                      </template>
                    </span>
                    <span slot="duration" slot-scope="duration">
                      <template>
                        {{ duration | secondToDate(false) }}
                      </template>
                    </span>
                    <span slot="profit" slot-scope="profit">
                      <template>
                        {{ profit | isEmpty(false) }}
                      </template>
                    </span>
                  </a-table>
                </a-tab-pane>
                <a-tab-pane class="tixsh-pane" key="4" tab="礼物">
                  <a-table
                    :columns="videoColumns"
                    :row-key="
                      (record, index) => {
                        return index;
                      }
                    "
                    :data-source="anchorGiftData"
                    :pagination="false"
                    bordered
                  >
                   <span slot="type" slot-scope="type">
                      <template>
                       礼物
                      </template>
                    </span>
                    <span slot="duration" slot-scope="duration">
                      <template>
                        {{ duration | secondToDate(false) }}
                      </template>
                    </span>
                    <span slot="profit" slot-scope="profit">
                      <template>
                        {{ profit | isEmpty(false) }}
                      </template>
                    </span>
                  </a-table>
                </a-tab-pane>
              </a-tabs>
            </div>
          </template>
        </a-card-meta>
      </a-card-grid>
    </a-card>

    <a-card style="border-top: 0">
      <a-card-grid class="card-box" style="width: 30%"> </a-card-grid>
    </a-card>

    <a-card style="border-top: 0">
      <a-card-grid class="card-box" style="width: 100%">
        <a-card-meta title="备注">
          <template slot="description" v-if="handleOk && operate==1"
            ><span class="fnt-success">已审核：【通过】</span></template
          >
          <template slot="description" v-if="handleOk && operate==0"
            ><span class="fnt-error">已审核：【不通过】</span></template
          >
          <template slot="description" v-if="!handleOk">
            <span class="fnt-error">*必填</span>
            <a-form>
              <a-form-item
                :labelCol="labelCol"
                labelAlign="left"
                :wrapperCol="wrapperCol"
              >
                <a-input
                  v-model="queryParam.message"
                  type="textarea"
                   v-decorator="['note', { rules: [{ required: true, message: '请填写备注信息' }] }]"
                />
              </a-form-item>
              <a-form-item label="">
                <a-button
                  type="primary"
                  size="large"
                  style="margin-right: 24px"
                  @click="withdrawClick(1)"
                  >审核通过</a-button
                >
                <a-button type="danger" size="large" @click="withdrawClick(0)"
                  >审核不通过</a-button
                >
              </a-form-item>
            </a-form>
          </template>
        </a-card-meta>
      </a-card-grid>
    </a-card>
    </a-spin>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { getProfile } from "@/api/system/userManager";
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

export default {
  name: "tixsh",
  components: {},
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      operate:null,
      confirmLoading: false,
      handleOk:false,
      // 查询参数
      queryParam: {},
      // 传值参数
      pageParam: {},
      // 个人信息结果数据
      profileData: {},
      anchorVideoData: [],
      anchorAudioData: [],
      anchorGiftData: [],
      anchorMsgData: [],
      labelCol: {
        xs: { span: "auto" },
        sm: { span: "100px" },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      // 表头
      videoColumns: [
        {
          title: "类型", //审核  空
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "时长",
          dataIndex: "duration",
          scopedSlots: { customRender: "duration" },
        },
        {
          title: "收益（聊币）",
          dataIndex: "profit",
          scopedSlots: { customRender: "profit" },
        },
        {
          title: "开始时间",
          dataIndex: "createTime",
          needTotal: false,
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          },
        },
      ],
    };
  },
  created() {
    this.confirmLoading = true;
   
  },
  filters: {

    isEmpty(__value,__type) {
      if(__value !== null && typeof __value !== undefined && __value !==undefined ) return __value;
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
      this.queryParam.orderNumber = this.pageParam.orderNumber;
      console.log("主播审核详情列表信息==>", this.pageParam);
       this.handleOk = false;
       this.queryParam.message='';
      // pageData.digitId='16422001';
      this.$nextTick(()=>{
        this.loadProfileData();
        
      });
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
      this.operate = __operate;
      let otherParam = { operate: __operate };
      withdrawHandle(Object.assign(otherParam, this.queryParam)).then((response) => {
        console.log("response-==>", response);
        if (response.success) {
          this.$message.success("操作成功");
          this.handleOk = response.success;
          this.$emit('searchForm');
        }
      });
    },
    //个人信息
    loadProfileData() {
      getProfile({ digitId: this.pageParam.digitId })
        .then((response) => {
          this.profileData = response.data;
          console.log("tixsh this.profileData ==> ",this.profileData);
           this.confirmLoading = false;
        })
        .then(() => {
          if (this.profileData.identity == 0) {
            this.getConsumers();
          } else {
            this.getAnchors();
          }
          
        });
    },
    getAnchors() {
      getAnchorCall({
        digitId: this.pageParam.digitId,
        pageSize: 10,
        pageSize: 1,
        type: 1,
      }).then((response) => {
        console.log('getAnchorCall type1==',response);
        this.anchorVideoData = response.data;
      });
      getAnchorCall({
        digitId: this.pageParam.digitId,
        pageSize: 10,
        pageSize: 1,
        type: 0,
      }).then((response) => {
        this.anchorAudioData = response.data;
      });
      getAnchorGift({ digitId: this.pageParam.digitId, pageSize: 10 }).then(
        (response) => {
          this.anchorGiftData = response.data;
        }
      );
      getAnchorMsg({ digitId: this.pageParam.digitId, pageSize: 10 }).then((response) => {
        this.anchorMsgData = response.data;
      });
    },
    getConsumers() {
      getConsumerCall({
        digitId: this.pageParam.digitId,
        pageSize: 10,
        pageSize: 1,
        type: 1,
      }).then((response) => {
        this.anchorVideoData = response.data;
        //临时数据
        // this.anchorVideoData = [
        //   {
        //     duration: 10,
        //     profit: 100,
        //     createTime: "2012-12-12",
        //   },
        // ];
      });
      getConsumerCall({
        digitId: this.pageParam.digitId,
        pageSize: 10,
        pageSize: 1,
        type: 0,
      }).then((response) => {
        this.anchorAudioData = response.data;
        //临时数据
        // this.anchorAudioData = [
        //   {
        //     duration: 10,
        //     profit: 1000000,
        //     createTime: "2012-12-12",
        //   },
        // ];
      });
      getConsumerGift({ digitId: this.pageParam.digitId, pageSize: 10 }).then(
        (response) => {
          this.anchorGiftData = response.data;
          //临时数据
          // this.anchorGiftData = [
          //   {
          //     duration: 10,
          //     profit: 44444444,
          //     createTime: "2012-12-12",
          //   },
          // ];
        }
      );
      getConsumerMsg({ digitId: this.pageParam.digitId, pageSize: 10 }).then(
        (response) => {
          this.anchorMsgData = response.data;
          //临时数据
          // this.anchorMsgData = [
          //   {
          //     duration: 10,
          //     profit: "33333",
          //     createTime: "2012-12-12",
          //   },
          // ];
        }
      );
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
  padding-bottom: 100%;
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
</style>
