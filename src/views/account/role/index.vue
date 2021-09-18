<template>
  <a-card :bordered="false">
        <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
         <a-col :md="24" :sm="24" style="text-align:right;">
           <a-button type="danger" @click="searchForm()">新增</a-button>
          </a-col>
        </a-row>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.id"
      :columns="columns"
      :data="loadData"
    >
    <span slot="nick" slot-scope="nick">
        <template>
          {{ nick | isEmpty(true) }}
        </template>
      </span>
    <span slot="action" slot-scope="text, record">
        <template>
        <a-tag color="red" @click="handleDelete(record)" v-has="{ perm: 'news:delete' }"
            >编辑权限</a-tag
          >
         
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { rechargeList } from "@/api/system/recharge";
import { STable } from "@/components";
export default {
  name: "roleList",
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
      type:1,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      rangeValue: [],
      selectRangeValue:"",
      // 表头
      columns: [
        {
          title: "角色",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },
       {
          title: "操作",
          dataIndex: "action",
          width: "120px",
          scopedSlots: { customRender: "action" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return rechargeList(Object.assign(parameter, this.queryParam))
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
  },
  filters: {
    statusType(__value, __status) {
      return __status[__value];
    },
    typeType(__value, __type) {
      return __type[__value];
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
      this.setStartValue();
      this.handleOk();
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
