<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户ID">
              <a-input v-model="queryParam.digitId" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="昵称">
              <a-input v-model="queryParam.nick" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input v-model="queryParam.phone" placeholder />
            </a-form-item>
          </a-col>

      <a-col :md="8" :sm="24">
          <a-form-item label="注册渠道号">
                <a-select v-model="queryParam.channelId" >
                 <a-select-option value="" key=""> 全部 </a-select-option>
                <a-select-option v-for="i in brandList" :key="i">
                  {{ i }}
                </a-select-option>
              </a-select>
          </a-form-item>
      </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="注册时间">
              <a-range-picker @change="rangeOnChange" @calendarChange="calendarPriceRangeChange" :value="rangeValue"  :disabled-date="disabledPriceRangeDate"   />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">搜索</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="ul-list">
      <span
        >用户总数：<em>{{ totalUser }}</em
        >人</span
      >
      <span>充值总额：<em>{{totalRecharge/100}} 元</em></span>
    </div>

    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.digitId"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: '100%' }"
    >

      <span slot="digitId" slot-scope="digitId">
        <template>
          {{ digitId | isEmpty(true) }}
        </template>
      </span>
      <span slot="nick" slot-scope="nick">
        <template>
          {{ nick | isEmpty(true) }}
        </template>
      </span>
      <span slot="phone" slot-scope="phone">
        <template>
          {{ phone | isEmpty(true) }}
        </template>
      </span>
      <span slot="coin" slot-scope="coin">
        <template>
          {{ coin | isEmpty(false) }}
        </template>
      </span>
      <span slot="rechargeCoin" slot-scope="rechargeCoin">
        <template>
          {{ rechargeCoin | isEmpty(false) }}
        </template>
      </span>
      <span slot="videoCoin" slot-scope="videoCoin">
        <template>
          {{ videoCoin | isEmpty(false) }}
        </template>
      </span>
      <span slot="audioCoin" slot-scope="audioCoin">
        <template>
          {{ audioCoin | isEmpty(false) }}
        </template>
      </span>
      <span slot="messageCoin" slot-scope="messageCoin">
        <template>
          {{ messageCoin | isEmpty(false) }}
        </template>
      </span>
      <span slot="giftCoin" slot-scope="giftCoin">
        <template>
          {{ giftCoin | isEmpty(false) }}
        </template>
      </span>
      <span slot="activeTime" slot-scope="activeTime">
        <template>
          {{ activeTime | isEmpty(true) }}
        </template>
      </span>
      <span slot="createTime" slot-scope="createTime">
        <template>
          {{ createTime | isEmpty(true) }}
        </template>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
        <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'cwfb:edit'}">详情</a-tag>
           <!-- <a-menu class="content-link">
            <a-menu-item key="/userManager/userlist/handle" v-has="{ perm: 'role:delete' }">
              <router-link :to="{ name: 'userDetail', params: { pageData: record } }">
                详情
              </router-link>
            </a-menu-item>
          </a-menu> -->
        </template>
      </span>
    </s-table>



    <a-drawer
      :title="drawer01.title"
      :width="drawer01.width"
      :maskClosable="false"
      :visible="drawer01.visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=>{drawer01.visible=false}"
    >
      <form-handle ref="formHandle" @ok="handleOk"  v-on:searchForm="searchForm"/>
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
      <a-button type="danger" @click="formhandleSeal()" v-has="{perm:'role:update'}" style="margin:0 5px;">封号</a-button>
      <a-button type="primary" @click="formhandleInvite()"  style="margin:0 5px;background:#23D96E; border:1px solid #15BC58;">绑定邀请人</a-button>
      <a-button type="primary" @click="formhandleEdit()" style="margin:0 5px;">修改</a-button>
        <a-button :style="{ marginRight: '8px' }" @click="()=>{drawer01.visible=false}">关闭</a-button>
      </div>
    </a-drawer>


  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import formHandle from './handle';
import { getConsumer,getBrandList } from "@/api/system/userManager";
import { STable } from "@/components";
import { dataStatus, dataTypes,sortColumnTypes,sortDirectionTypes } from "@/config/serverstatus";
export default {
  name: "userList",
  components: {
    STable,formHandle
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
        title: '用户-编辑'
      },
      dataStatus,
      dataTypes,
      sortColumnTypes,
      sortDirectionTypes,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {

      },
      rangeValue: [],
      selectRangeValue:"",
      totalUser: 0,
      totalRecharge:0,
      brandList:[ ],
      // 表头
      columns: [
        {
          title: "用户ID",
          dataIndex: "digitId",
          width: "100px",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "昵称",
          dataIndex: "nick",
          width: "180px",
          scopedSlots: { customRender: "nick" },
        },
        {
          title: "手机号",
          dataIndex: "phone",
          width: "150px",
          scopedSlots: { customRender: "phone" },
        },
        {
          title: "账户余额(聊币)   ",
          sorter: true,
          dataIndex: "coin",
          width: "150px",
          scopedSlots: { customRender: "coin" },
        },
        {
          title: "充值总额(聊币)",
          sorter: true,
          dataIndex: "rechargeCoin",
          width: "150px",
          scopedSlots: { customRender: "rechargeCoin" },
        },
        {
          title: "视频消费(聊币)",
          sorter: true,
          dataIndex: "videoCoin",
          width: "150px",
          scopedSlots: { customRender: "videoCoin" },
        },
        {
          title: "语音消费(聊币)",
          sorter: true,
          dataIndex: "audioCoin",
          width: "150px",
          scopedSlots: { customRender: "audioCoin" },
        },
        {
          title: "私信消费(聊币)",
          sorter: true,
          dataIndex: "messageCoin",
          width: "150px",
          scopedSlots: { customRender: "messageCoin" },
        },
        {
          title: "礼物消费(聊币)",
          sorter: true,
          dataIndex: "giftCoin",
          width: "150px",
          scopedSlots: { customRender: "giftCoin" },
        },
        {
          title: "注册时间",
          dataIndex: "createTime",
          sorter: true,
          needTotal: false,
          width: "180px",
          scopedSlots: { customRender: "createTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // },
        },
        {
          title: "最近登录时间",
          dataIndex: "activeTime",
          sorter: true,
          needTotal: false,
          width: "180px",
          scopedSlots: { customRender: "activeTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // },
        },

        {
          title: "版本号",
          dataIndex: "appVersion",
           width: "180px",
          scopedSlots: { customRender: "appVersion" },
        },
         {
          title: "version",
          dataIndex: "version",
           width: "180px",
          scopedSlots: { customRender: "version" },
        },
        
          {
          title: "渠道号",
          dataIndex: "channelId",
           width: "180px",
          scopedSlots: { customRender: "channelId" },
        },
        
        {  
          title: "操作", //审核  空
          dataIndex: "action",
          width: "120px",
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let loadDataParam =Object.assign(parameter, this.queryParam);
        console.log(loadDataParam)
        loadDataParam.sortColumn = sortColumnTypes[loadDataParam.sortField] || 0;
        loadDataParam.sortDirection = sortDirectionTypes[loadDataParam.sortOrder] || 1;
        delete loadDataParam.sortField;
        delete loadDataParam.sortOrder;
          
        return getConsumer(loadDataParam)
          .then((response) => {
           // console.log("zhub==>", response);
            let res = {
              // hasNext: true,
              pageCount: response.extra.totalPage,
              pageIndex: response.extra.currPage,
              pageSize: 10,
              total: response.extra.totalEle,
              rows: [],
            };
             res.rows = response.data;
              console.log( response.data)
            this.totalUser = response.extra.totalUser;
            this.totalRecharge = response.extra.totalRecharge;            
            //临时数据
            // let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
            // res.rows = response.data;
            // res.rows = [
            //   {
            //     activeTime: "2020-12-22T05:17:48.979Z",
            //     audioCoin: 0,
            //     coin: 0,
            //     createTime: "2020-12-22T05:17:48.979Z",
            //     digitId: "string",
            //     giftCoin: 0,
            //     messageCoin: 0,
            //     nick: "string",
            //     phone: "string",
            //     rechargeCoin: 0,
            //     videoCoin: 0,
            //   },
            // ];
            return res;
          })
          .catch((response) => {
            this.$message.warn(response.message);
          });
      },
    };
  },
  created() {
    // this.loadData(this.queryParam);
    this.setStartValue();
    
  },

 mounted(){
 this.setBrandList();
 },
  
  filters: {
    statusType(__value, __status) {
      return __status[__value];
    },
    typeType(__value, __type) {
      return __type[__value];
    },
    isEmpty(__value,__type) {
      if(__value !== null && typeof __value !== 'undefined') return __value;
      if(__type){
        return '-';
      }else{
        return '0';
      }
    },
  },
  methods: {
    setStartValue(){
      var myDate = new Date();
      var yesterDaytime=(new Date).getTime()-24*60*60*1000;
      this.queryParam.startTime =moment(myDate).format("YYYY-MM-DD")+' 00:00:00';
      this.queryParam.endTime =moment(myDate).format("YYYY-MM-DD")+' 23:59:59';
      this.rangeValue = [ moment(myDate).format("YYYY-MM-DD"), moment(myDate).format("YYYY-MM-DD")];
    },
//选择开始时间/结束时间
    calendarPriceRangeChange(date){
      this.selectRangeValue = date[0];
    },
	//根据选择的开始时间/结束时间，动态渲染要禁用的日期
    disabledPriceRangeDate(current){
        if(this.selectRangeValue){
          var daytime=moment(this.selectRangeValue, 'YYYY-MM-DD').valueOf();
          var daytime2=moment(this.selectRangeValue, 'YYYY-MM-DD').valueOf() + 24*31*60*60*1000;
          return current > moment().endOf('day') || current < moment(daytime).startOf('day') || current > moment(daytime2).endOf('day')

        }else{
          return current > moment().endOf('day')
        }
    },
    rangeOnChange(date, dateString) {
       this.selectRangeValue = '';
      this.rangeValue = date;
      if(this.rangeValue.length==0){
          delete this.queryParam.startTime;
          delete this.queryParam.endTime;
        return;
      }else{
        this.queryParam.startTime =dateString[0] + " 00:00:00";
        this.queryParam.endTime = dateString[1] + " 23:59:59";
      }
    },

    handleOk() {
      this.$refs.table.refresh();
    },
    searchForm() {
      console.log('seartch-------------------');
      this.queryParam = {
        pageIndex: 1,
        pageSize: 30,
      };
      
      this.rangeValue = [];
       this.setStartValue();
      this.handleOk();
    },
    resetSearchForm() {
      this.queryParam = {
        pageIndex: 1,
        pageSize: 30,
      };
      this.rangeValue = [];
     this.setStartValue();
      this.handleOk();
    },
     handleEdit (record) {
      this.drawer01.visible = true
      this.drawer01.title =record.nick +'-用户编辑'
      this.$nextTick(() => {
        this.$refs.formHandle.edit(record)
      })
    },
    handleOk () {
      this.$refs.table.refresh()
      this.drawer01.visible = false
    },
    formhandleEdit(){
      this.$refs.formHandle.handleEdit()
    },
    formhandleSeal(){
      this.$refs.formHandle.handleSeal()
    },
    formhandleInvite(){
      this.$refs.formHandle.handleInvite();
    },
    setBrandList(){
        getBrandList()
          .then((response) => {
         this.brandList=response.data;
         console.log(this.brandList)
     
          })
          .catch((response) => {
            this.$message.warn(response.message);
          });

    },
  },
};
</script>

<style lang="less" scoped>
.content-link {
  margin: 0;
  padding: 0;
  background: none;
  border: 0;
  li {
    padding: 0;
    margin: 0;
    height: inherit;
    line-height: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    -webkit-font-feature-settings: "tnum";
    font-feature-settings: "tnum";
    display: inline-block;
    height: auto;
    margin-right: 8px;
    padding: 0 7px;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    background: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: default;
    opacity: 1;
    -webkit-transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    color: #52c41a;
    background: #f6ffed;
    border-color: #b7eb8f;
  }
}
.ant-drawer-body{ padding:0 !important;}
.ant-drawer .ant-drawer-content{ height:auto !important;}
</style>
