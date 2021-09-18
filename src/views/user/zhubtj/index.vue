<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户ID">
              <a-input v-model="queryParam.digitId" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="昵称">
              <a-input v-model="queryParam.nick" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
           <a-form-item label="性别">
               <a-select  v-model="queryParam.gender" placeholder >
                  <a-select-option :value="0"> 女 </a-select-option>
                  <a-select-option :value="1"> 男 </a-select-option>
                </a-select>
            </a-form-item>
           
          </a-col>

           <a-col :md="6" :sm="24">
          <a-form-item label="注册渠道号">
                <a-select v-model="queryParam.channelId">
                  <a-select-option value="" key=""> 全部 </a-select-option>
                <a-select-option v-for="i in brandList" :key="i">
                  {{ i }}
                </a-select-option>
              </a-select>
          </a-form-item>
      </a-col>
          <a-col :md="6" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="searchForm">搜索</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-radio-group v-model="type" :style="{ marginBottom: '8px' }" @change="radioChange" >
      <a-radio-button :value="0"> 首页-推荐一 </a-radio-button>
      <a-radio-button :value="6"> 首页-推荐二 </a-radio-button>
      <a-radio-button :value="7"> 首页-推荐三 </a-radio-button>
      <!-- <a-radio-button :value="1"> 活跃-首页 </a-radio-button> -->
      <a-radio-button :value="2"> 推荐-新人 </a-radio-button>
      <!-- <a-radio-button :value="3"> 推荐池-全局 </a-radio-button> -->
      <a-radio-button :value="4"> 推荐池-视频 </a-radio-button>
      <a-radio-button :value="3"> 推荐池-私信 </a-radio-button>
      <a-radio-button :value="5">审核池</a-radio-button>
    </a-radio-group>

    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.digitId"
      :columns=" type==4 || type==0 || type==6 || type==7  ? columnsVideo :columns"
      :data="loadData"
      :scroll="{ x: '100%' }"
    >


      <!-- <span slot="levelStart" slot-scope="text, record,index">
        <template>
          {{  index+1 | isEmpty(true) }}
        </template>
      </span> -->

      <span slot="level" slot-scope="level">
        <template>
          {{ level | isEmpty(true) }}
        </template>
      </span>
       <span slot="type" slot-scope="type">
        <template>
          <span class="fnt-error">{{ type | typeType(anchorRecommendTypes) }}</span>
        </template>
      </span>
      
      <span slot="digitId" slot-scope="digitId">
        <template>
        <!-- <a-tag color="blue" style="background:none; border:0; cursor: pointer;" @click="handleEdit(record)" v-has="{perm:'cwfb:edit'}"> -->
          {{ digitId | isEmpty(true) }}
          <!-- </a-tag> -->
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


     <span slot="gender" slot-scope="gender">
        <template>
          {{ gender | typeType(genderTypes) }}
        </template>
      </span>

    <span slot="times" slot-scope="text, record">
      <template>
        {{ record.startTime | isEmptyNo(true) }} {{record.startTime==null && record.endTime==null?'-':'~'}} {{ record.endTime | isEmptyNo(true) }} 
      </template>
    </span>

    <span slot="times2" slot-scope="text, record">
      <template>
        {{ record.startTime2 | isEmptyNo(true) }}  {{record.startTime2==null && record.endTime2==null?'-':'~'}} {{ record.endTime2 | isEmptyNo(true) }}
      </template>
    </span>     
    
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="red" @click="handleRecommend(record)" v-has="{ perm: 'role:delete' }"
            >修改</a-tag
          >
          <a-tag color="red" @click="handleRemove(record)" v-has="{ perm: 'role:delete' }"
            >取消推荐</a-tag
          >
        </template>
      </span>
    </s-table>

     <form-handle ref="formHandle" @ok="handleOk" v-on:searchForm="searchForm" />


<a-drawer
      :title="drawer01.title"
      :width="drawer01.width"
      :maskClosable="false"
      :visible="drawer01.visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=>{drawer01.visible=false}"
    >
      <zhub-form-handle ref="zhubFormHandle" @ok="handleOk"  v-on:searchForm="searchForm"/>
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
      <a-button type="primary" @click="formhandleRecommend(type)" v-has="{perm:'role:update'}" style="margin:0 5px;">主播推荐</a-button>
      <a-button type="primary" @click="formhandleEdit()" style="margin:0 5px;">修改</a-button>
        <a-button :style="{ marginRight: '8px' }" @click="()=>{drawer01.visible=false}">关闭</a-button>
      </div>
    </a-drawer>


  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import formHandle from "@/views/user/zhub/recommendEdit";
import zhubFormHandle from '@/views/user/zhub/handle';
import { getAnchorRecommend,anchorRecommendHandle,getBrandList } from "@/api/system/userManager";
import { STable } from "@/components";
import {anchorRecommendTypes,genderTypes } from "@/config/serverstatus";
export default {
  name: "zhubtjList",
  components: {
    STable,formHandle,zhubFormHandle
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
        title: '主播详情'
      },
      anchorRecommendTypes,
      genderTypes,
      type:0,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      rangeValue: [],
       brandList:[ ],
      selectRangeValue:"",
      // 表头
      columns: [
        {
          title: "序号",
          dataIndex: "level",
          width: "120px",
          scopedSlots: { customRender: "level" },
        },
        {
          title: "推荐模块",
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "用户ID",
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "昵称",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },
        // {
        //   title: "手机号",
        //   dataIndex: "phone",
        //   scopedSlots: { customRender: "phone" },
        // },
        {
          title: "性别",
          dataIndex: "gender",
          scopedSlots: { customRender: "gender" },
          
        },
        {  
          title: "操作", //审核  空
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      // 推荐池-视频 表头
      columnsVideo: [
        {
          title: "序号",
          dataIndex: "level",
          width: "120px",
          scopedSlots: { customRender: "level" },
        },
        {
          title: "推荐模块",
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "用户ID",
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "昵称",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },
        {
          title: "推荐时段一",
          dataIndex: "times",
          scopedSlots: { customRender: "times" },
        },
        {
          title: "推荐时段二",
          dataIndex: "times2",
          scopedSlots: { customRender: "times2" },
        },
        // {
        //   title: "手机号",
        //   dataIndex: "phone",
        //   scopedSlots: { customRender: "phone" },
        // },
        {
          title: "性别",
          dataIndex: "gender",
          scopedSlots: { customRender: "gender" },
          
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
          scopedSlots: { customRender: "action" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let typelist = { type: this.type };
        return getAnchorRecommend(Object.assign(parameter, this.queryParam, typelist))
          .then((response) => {
            console.log("zhubtj==>", response);
            let res = {
              // hasNext: true,
              pageCount: response.extra.totalPage,
              pageIndex: response.extra.currPage,
              pageSize: 10,
              total: response.extra.totalEle,
              rows: [],
              // userCount:response.extra.userCount,
            };
             res.rows = response.data;
            //临时数据
            // let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
            // res.rows = response.data;
            // res.rows = [
            //   {
            //     digitId: "string",
            //     gender: 0,
            //     level: 0,
            //     nick: "string",
            //     phone: "string",
            //     type: 0,
            //   },
            // ];
            return res;
          })
          .catch((response) => {
            this.$message.warn(response.message);
          });
      },
      loadData2: (parameter) => {
        let typelist = { type: 2 };
        return getAnchorRecommend(Object.assign(parameter, this.queryParam, typelist))
          .then((response) => {
            console.log("zhub==>", response);
            // let res = {
            //   // hasNext: true,
            //   pageCount: response.extra.totalPage,
            //   pageIndex: response.extra.currPage,
            //   pageSize: 10,
            //   total: response.extra.totalEle,
            //   rows: [],
            //   userCount:response.extra.userCount,
            // };
            //  res.rows = response.data;
            //临时数据
            let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
            res.rows = response.data;
            res.rows = [
              {
                digitId: "string",
                gender: 0,
                level: 0,
                nick: "string",
                phone: "string",
                type: 0,
              },
            ];
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
    // this.setStartValue();
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
    isEmptyNo(__value,__type) {
      if(__value !== null && typeof __value !== 'undefined') return __value;
      if(__type){
        return '';
      }else{
        return '0';
      }
    },
  },
  methods: {
    radioChange(e){
      console.log('radio1 checked', e.target.value);
      this.searchForm();
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
    callback(key) {
      console.log(key);
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    setStartValue(){
      var myDate = new Date();
      var yesterDaytime=(new Date).getTime()-24*60*60*1000;
      this.queryParam.startTime =moment(myDate).format("YYYY-MM-DD")+' 00:00:00';
      this.queryParam.endTime =moment(myDate).format("YYYY-MM-DD")+' 23:59:59';
      this.rangeValue = [ moment(myDate).format("YYYY-MM-DD"), moment(myDate).format("YYYY-MM-DD")];
    },
    resetSearchForm() {
      this.queryParam = {
        pageIndex: 1,
        pageSize: 30,
      };
      this.rangeValue = [];
      // this.setStartValue();
      this.handleOk();
    },
    handleRecommend(record) {
      this.$refs.formHandle.edit(record);
    },
    handleRemove(record) {
      const that = this;
      this.$confirm({
        title: "取消推荐",
        content: (h) => (
          <div style="color:#000; font-size:15px;">
            确定要取消用户“{record.nick}”的推荐位置吗？
          </div>
        ),
        onOk() {
          var values  ={
          digitId: record.digitId,
          recommend:0,
          type:record.type,
          level:record.level
          }
            anchorRecommendHandle(values).then(response => {
              if (response.code === 0) {
                that.$message.info(response.message)
                that.handleOk();
                that.$emit('ok')
              }else{
                that.$message.error(response.message)
              }
            })
        },
        onCancel() {},
      });
    },
    handleEdit (record) {
      this.drawer01.visible = true
      this.drawer01.title = record.nick +'-主播详情'
      this.$nextTick(() => {
        this.$refs.zhubformHandle.edit(record)
      })
    },
    handleOk () {
      this.$refs.table.refresh()
      this.drawer01.visible = false
    },
    formhandleEdit(){
      this.$refs.zhubformHandle.handleEdit();
      // this.$refs.table.refresh();
    },
    formhandleRecommend(type){
      this.$refs.zhubformHandle.handleRecommend(type)
    },
    formhandleSeal(){
      this.$refs.zhubformHandle.handleSeal()
    },
    tableRefresh(){
      console.log('88888');
      this.$refs.table.refresh();
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
</style>
