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
            <a-form-item label="充值状态">
               <a-select v-model="queryParam.status">
                <a-select-option :value="2"> 全部 </a-select-option>
                <a-select-option :value="0"> 未完成  </a-select-option>
                <a-select-option :value="1"> 已完成  </a-select-option>
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
         
         <a-col :md="6" :sm="24">
            <a-form-item label="充值时间">
              <a-range-picker @change="rangeOnChange" @calendarChange="calendarPriceRangeChange" :value="rangeValue"  :disabled-date="disabledPriceRangeDate"   />
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
        </a-row>
        </a-row>
      </a-form>
    </div>

    <div class="ul-list">
      <span>充值人数：<em>{{totalCount}}</em>人</span>
      <span>充值总额：<em>{{totolRecharge}}</em>元</span>
    </div>
    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.orderNumber"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: '100%' }"
    >

      <span slot="orderNumber" slot-scope="orderNumber">
        <template>
          {{ orderNumber | isEmpty(true) }}
        </template>
      </span>
      <span slot="digitId" slot-scope="digitId">
        <template>
          {{ digitId | isEmpty(true) }}
        </template>
      </span>
      <span slot="coin" slot-scope="coin">
        <template>
          {{ coin | isEmpty(false) }}
        </template>
      </span>
      <span slot="coinBefore" slot-scope="coinBefore">
        <template>
          {{ coinBefore | isEmpty(false) }}
        </template>
      </span>
      <span slot="coinAfter" slot-scope="coinAfter">
        <template>
          {{ coinAfter | isEmpty(false) }}
        </template>
      </span>
      <span slot="createTime" slot-scope="createTime">
        <template>
          {{ createTime | isEmpty(true) }}
        </template>
      </span>
      
     <span slot="status" slot-scope="status">
        <template>
          <span class="fnt-error">{{ status | statusType(chongzStatus) }}</span>
        </template>
      </span>
    </s-table>

  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { rechargeList,getBrandList } from "@/api/system/recharge";
import { STable } from "@/components";
import { chongzStatus } from "@/config/serverstatus";
export default {
  name: "chongzList",
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
      chongzStatus,
      type:1,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      rangeValue: [],
     brandList:[ ],
      selectRangeValue:"",
      totalCount:'',
      totolRecharge:'',
      // 表头
      columns: [
        {
          title: "订单号",
          dataIndex: "orderNumber",
          width: "240px",
          scopedSlots: { customRender: "giftProfit" },
        },
        {
          title: "用户ID",
          dataIndex: "digitId",
          width: "120px",
          scopedSlots: { customRender: "giftProfit" },
        },
        {
          title: "昵称",
          dataIndex: "nick",
          width: "100px",
          scopedSlots: { customRender: "nick" },
        },
         {
          title: "渠道号",
          dataIndex: "channelId",
           width: "180px",
          scopedSlots: { customRender: "channelId" },
        },
        // {
        //   title: "渠道",
        //   dataIndex: "nick",
        //   width: "120px",
        //   scopedSlots: { customRender: "nick" },
        // },
        {
          title: "充值额（聊币）",
          dataIndex: "coin",
           width:"150px",
           scopedSlots: { customRender: "coin" },
        },
        {
          title: "充值前余额（聊币）",
          dataIndex: "coinBefore",
           width:"150px",
           scopedSlots: { customRender: "coinBefore" },
        },
        {
          title: "充值后余额（聊币）",
          dataIndex: "coinAfter",
          width:"180px",
          scopedSlots: { customRender: "coinAfter" },
        },
        {
          title: "状态",
          dataIndex: "status",
          width:"120px",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "充值时间",
          dataIndex: "createTime",
          needTotal: false,
          width:"180px",
          scopedSlots: { customRender: "createTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // }
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return rechargeList(Object.assign(parameter, this.queryParam))
          .then((response) => {
            console.log("zhub==>", response);
            let res = {
              // hasNext: true,
              pageCount: response.extra.totalPage,
              pageIndex: response.extra.currPage,
              pageSize: 10,
              total: response.extra.totalEle,
              rows: [],
            };
             res.rows = response.data;
            this.totolRecharge = response.extra.totolRecharge;
            this.totalCount = response.extra.totalCount;

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
      this.queryParam.startTime = moment(myDate).format("YYYY-MM-DD")+' 00:00:00';
      this.queryParam.endTime =moment(myDate).format("YYYY-MM-DD")+' 23:59:59';
      this.rangeValue = [ moment(myDate).format("YYYY-MM-DD"), moment(myDate).format("YYYY-MM-DD")];
    },

    add(data){
      this.queryParam.digitId = data.digitId;
      this.queryParam.nick = data.nick;
      this.loadData(this.queryParam);
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
    resetSearchForm() {
      this.queryParam = {
        pageIndex: 1,
        pageSize: 30,
      };
      this.rangeValue = [];
      this.setStartValue();
      this.handleOk();
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
