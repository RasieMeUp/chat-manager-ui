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
            <a-form-item>
               <a-range-picker @change="rangeOnChange" @calendarChange="calendarPriceRangeChange" :value="rangeValue"  :disabled-date="disabledPriceRangeDate"   />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
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

    <s-table
      ref="table"
      size="default"
      :rowKey="record => record.orderNumber"
      :columns="columns"
      :data="loadData"
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

       <span slot="nick" slot-scope="nick">
        <template>
          {{ nick | isEmpty(true) }}
        </template>
      </span>
       <span slot="drawActual" slot-scope="drawActual">
        <template>
         {{ drawActual | isEmpty(false) }}
        </template>
      </span>
       <span slot="coinAfter" slot-scope="coinAfter">
        <template>
          {{ coinAfter | isEmpty(false) }}
        </template>
      </span>
       
     
      <span slot="status" slot-scope="status">
        <template>
          <span class="fnt-error">{{ status | statusType(dataStatus) }}</span>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'cwfb:edit'}">审核</a-tag>
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
        <a-button :style="{ marginRight: '8px' }" @click="()=>{drawer01.visible=false}">关闭</a-button>
      </div>
    </a-drawer>



  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import formHandle from './handle';
import { getWithdrawAuditList } from "@/api/system/withdrawManager";
import { STable } from "@/components";
import { dataStatus } from "@/config/serverstatus";
export default {
  name: "tixsqList",
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
        title: '提现申请-审核'
      },
      dataStatus,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      rangeValue: [],
      selectRangeValue:"",
      // 表头
      columns: [
        {
          title: "订单号",
          sorter: true,
          dataIndex: "orderNumber",
          scopedSlots: { customRender: "orderNumber" }
        },
        {
          title: "用户ID",
          sorter: true,
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" }
        },
        {
          title: "昵称",
          dataIndex: "nick",
           scopedSlots: { customRender: "nick" }
        },
        {
          title: "提现额（聊币）",
          sorter: true,
          dataIndex: "drawActual",
           scopedSlots: { customRender: "drawActual" }
        },
        {
          title: "当前余额（聊币）",
          sorter: true,
          dataIndex: "coinAfter",
           scopedSlots: { customRender: "coinAfter" }
        },
        {
          title: "状态", //待审核  审核未通过  [0:未审核，10：审核中，20：审核未通过，21：审核取消，22：审核冻结，30：审核通过，40：打款完成，41：打款失败，42：部分打款，43：打款冻结]
          dataIndex: "status",
          sorter: true,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "申请时间",
          dataIndex: "createTime",
          sorter: true,
          needTotal: false,
           scopedSlots: { customRender: "createTime" }
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // },
        },
        {
          title: "操作", //审核  空
          dataIndex: "action",
          width: "120px",
          scopedSlots: { customRender: "action" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getWithdrawAuditList(Object.assign(parameter, this.queryParam))
          .then((response) => {
           
            let res = {
              // hasNext: true,
              pageCount: response.extra.totalPage,
              pageIndex: response.extra.currPage,
              pageSize: 10,
              total: response.extra.totalEle,
              rows: [],
            };
            res.rows = response.data;
            // res.rows = [{
            //   orderNumber:'11',
            //   digitId:'12312',
            //   nick:'122',
            //   identity:0
            // }]
             console.log('tixlist ==>',res);
            return res;
          })
          .catch((response) => {
            that.$message.warn(response.message);
          });
      },
    };
  },
  created() {
    // this.loadData(this.queryParam);
    this.setStartValue();
  },
  filters: {
    statusType(__value, __status) {
      return __status[__value];
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
      this.$refs.table.refresh(true);
      this.drawer01.visible = false
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
      this.drawer01.title =record.nick +'-提现审核'
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
</style>
