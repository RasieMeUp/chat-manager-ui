<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
           <a-col :md="6" :sm="10">
            <a-form-item label="发起人ID">
              <a-input v-model="queryParam.callDigitId" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-item label="发起人昵称">
              <a-input v-model="queryParam.callNick" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-item label="接听人ID">
              <a-input v-model="queryParam.acceptDigitId" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-item label="接听人昵称">
              <a-input v-model="queryParam.acceptNick" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-item label="通话类型">
               <a-select  v-model="queryParam.type" placeholder >
                  <a-select-option :value="100"> 全部 </a-select-option>
                  <a-select-option :value="0"> 音频 </a-select-option>
                  <a-select-option :value="1"> 视频 </a-select-option>
                </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="10">
            <a-form-item label="是否接通">
               <a-select  v-model="queryParam.connected" placeholder >
               <a-select-option :value="100"> 全部 </a-select-option>
                  <a-select-option :value="1"> 是 </a-select-option>
                  <a-select-option :value="0"> 否 </a-select-option>
                </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="10">
            <a-form-item label="发起时间">
              <a-range-picker @change="rangeOnChange" @calendarChange="calendarPriceRangeChange" :value="rangeValue"  :disabled-date="disabledPriceRangeDate"   />
            </a-form-item>
          </a-col>
        
          <a-col :md="6" :sm="10">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="searchForm()">搜索</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="ul-list">
      <span style="width:20%" >拨打人数：<em>{{callUsers | isEmpty(false) }}</em ></span >
      <span  style="width:20%" >拨打次数：<em>{{callTimes | isEmpty(false) }}</em ></span >
      <span  style="width:20%" >接通人数：<em>{{acceptUsers | isEmpty(false) }}</em ></span >
      <span  style="width:20%" >接通次数：<em>{{acceptTimes | isEmpty(false) }}</em ></span >
      <span  style="width:20%" >接通率：<em>{{ connectedRatio * 100 | isEmpty(false) }} </em >%</span >
      <span  style="width:30%" >通话总时长：<em>{{totalDuration  | secondToDate(false) }}</em >
       <!-- {{ aa | secondToDate(false) }} -->
       </span >
      <span style="width:30%"  >平均通话时长：<em>{{avgDuration | secondToDate(false)}}</em ></span >
      <span style="width:30%"  >视频卡：<em>{{videoCard | isEmpty(false)}}</em ></span >
    </div>

    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.digitId"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: '100%' }"
    >

      <span slot="callDigitId" slot-scope="callDigitId">
        <template>
          {{ callDigitId | isEmpty(true) }}
        </template>
      </span>
      <span slot="callNickBox"  slot-scope="text, record">
        <template>
          {{ record.callNick | isEmpty(true) }} {{ record.mode == 1?"(主播)":''}}
        </template>
      </span>
      <span slot="acceptDigitId" slot-scope="acceptDigitId">
        <template>
          {{ acceptDigitId | isEmpty(true) }}
        </template>
      </span>
      <span slot="acceptNickBox"  slot-scope="text, record">
        <template>
          {{ record.acceptNick | isEmpty(true) }} {{ record.mode == 0?"(主播)":''}}
        </template>
      </span>
      <span slot="type" slot-scope="type">
        <template>
          {{ type | statusType(callTypes) }}
        </template>
      </span>
      <span slot="connected" slot-scope="connected">
        <template>
          {{ connected==1?'是':connected==0?'否':'-' }}
        </template>
      </span>

      <span slot="duration" slot-scope="duration">
        <template>
          {{ duration | secondToDate(false) }}
        </template>
      </span>

      <span slot="startTime" slot-scope="startTime">
        <template>
          {{ startTime | isEmpty(false) }}
        </template>
      </span>   
      <span slot="endTime" slot-scope="endTime">
        <template>
          {{ endTime | isEmpty(true) }}
        </template>
      </span>     
      
      <span slot="freeCard" slot-scope="freeCard">
        <template>
          {{ freeCard | isEmpty(false) }}
        </template>
      </span>




      <span slot="action" slot-scope="text, record">
        <template>
        <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'cwfb:edit'}">详情</a-tag>
        </template>
      </span>
    </s-table>


    <a-drawer
      :title="drawer01.title"
      :width="drawer01.width"
      :maskClosable="false"
      :visible="drawer01.visible"
      :body-style="{ paddingBottom: '80px',height:'50% !important' }"
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
        <a-button :style="{ marginRight: '8px' }" @click="()=>{drawer01.visible=false}">关闭</a-button>
      </div>
    </a-drawer>




  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import formHandle from './handle';
import { getCallList } from "@/api/system/callManager";
import { STable } from "@/components";
import { dataStatus, dataTypes ,genderTypes,sortColumnTypes,sortDirectionTypes,callTypes } from "@/config/serverstatus";
export default {
  name: "calllogList",
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
      callTypes,
      callUsers:0,
      callTimes:0,
      acceptUsers:0,
      acceptTimes:0,
      connectedRatio:0,
      avgDuration:0,
      totalDuration:0,
      videoCard:0,
      drawer01: {
        visible: false,
        title: '通话记录详情'
      },
      dataStatus,
      dataTypes,
      genderTypes,
      sortColumnTypes,
      sortDirectionTypes,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        // sortColumn: 0,
        // sortDirection:1
        type:100,
        connected:100
      },
      rangeValue: [],
      selectRangeValue:"",
      totalUser:0,
      // 表头
      columns: [
        {
          title: "发起人ID",
          dataIndex: "callDigitId",
          width: "100px",
          scopedSlots: { customRender: "callDigitId" },
        },
        {
          title: "发起人昵称",
          dataIndex: "callNickBox",
          width: "180px",
          scopedSlots: { customRender: "callNickBox" },
        },
        {
          title: "接听人ID",
          dataIndex: "acceptDigitId",
          width: "150px",
          scopedSlots: { customRender: "acceptDigitId" },
        },
        {
          title: "接听人昵称",
          sorter: true,
          dataIndex: "acceptNickBox",
          width: "150px",
          scopedSlots: { customRender: "acceptNickBox" },
        },
        {
          title: "通话类型",
          sorter: true,
          dataIndex: "type",
          width: "150px",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "是否接通",
          sorter: true,
          dataIndex: "connected",
          width: "150px",
          scopedSlots: { customRender: "connected" },
        },
        {
          title: "通话时长",
          sorter: true,
          dataIndex: "duration",
          width: "150px",
          scopedSlots: { customRender: "duration" },
        },

        {
          title: "视频卡",
          sorter: true,
          dataIndex: "freeCard",
          width: "150px",
          scopedSlots: { customRender: "freeCard" },
        },
        {
          title: "发起时间",
          dataIndex: "startTime",
          sorter: true,
          needTotal: false,
          width: "180px",
          scopedSlots: { customRender: "startTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // },
        },
         {
          title: "结束时间",
          dataIndex: "endTime",
          sorter: true,
          needTotal: false,
          width: "180px",
          scopedSlots: { customRender: "endTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // },
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

        // console.log('parameter=',parameter);
        // console.log('queryParam=',this.queryParam);
        let loadDataParam =Object.assign(parameter, this.queryParam);
        // loadDataParam.sortColumn = sortColumnTypes[loadDataParam.sortField] || 0;
        // loadDataParam.sortDirection = sortDirectionTypes[loadDataParam.sortOrder] || 1;
        // delete loadDataParam.sortField;
        // delete loadDataParam.sortOrder;

        console.log('loadData=',loadDataParam);
        if(loadDataParam.type==100)loadDataParam.type ='';
         if(loadDataParam.connected==100)loadDataParam.connected ='';
        return getCallList(loadDataParam)
          .then((response) => {
            console.log("calllogList==>", response);
            let res = {
              // hasNext: true,
              pageCount: response.extra.totalPage,
              pageIndex: response.extra.currPage,
              total: response.extra.totalEle,
              rows: [],
              userCount:response.extra.userCount,
            };
            //  res.rows = response.data;
            this.callUsers= response.extra.callUsers;
            this.callTimes = response.extra.callTimes;
            this.acceptUsers = response.extra.acceptUsers;
            this.acceptTimes = response.extra.acceptTimes;
            this.avgDuration = response.extra.avgDuration;
            this.connectedRatio = response.extra.connectedRatio;
            this.totalDuration = response.extra.totalDuration;
            this.videoCard =  response.extra.videoCard;
            //临时数据
            res.rows = response.data;
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
    this.setStartValue();  //第一次打开，后续无用
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
    setStartValue(){
      var myDate = new Date();
      var yesterDaytime=(new Date).getTime()-24*60*60*1000;
      this.queryParam.startTime = moment(myDate).format("YYYY-MM-DD")+' 00:00:00';
      this.queryParam.endTime =moment(myDate).format("YYYY-MM-DD")+' 23:59:59';
      this.rangeValue = [ moment(myDate).format("YYYY-MM-DD"), moment(myDate).format("YYYY-MM-DD")];
      // this.queryParam.type = 0 ;
      // this.queryParam.connected = 0;
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
    searchForm(){
      this.$refs.table.refresh();
    },
    resetSearchForm() {
      this.queryParam = {
        pageIndex: 1,
        pageSize: 30,
        type:100,
        connected:100
        // sortColumn: 0,
        // sortDirection:1
      };
      this.rangeValue = [];
      this.setStartValue();
      this.handleOk();
    },
    handleEdit (record) {
      this.drawer01.visible = true
      this.$nextTick(() => {
        this.$refs.formHandle.edit(record)
      })
    },
    handleOk () {
      this.$refs.table.refresh()
      this.drawer01.visible = false
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
.ant-drawer-right .ant-drawer-content-wrapper{right:30% !important;}

.ant-drawer-right .ant-drawer-content-wrapper{height:50% !important;}

</style>
