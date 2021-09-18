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
            <a-form-item label="身份">
              <a-select v-model="queryParam.identity">
                <a-select-option :value="0"> 普通用户 </a-select-option>
                <a-select-option :value="1"> 主播用户 </a-select-option>
              </a-select>
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
      :rowKey="(record) => record.forbiddenTime"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: '100%' }"
    >
    <!-- :rowKey="(record) => record.digitId" -->

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
      <span slot="identity" slot-scope="identity">
        <template>
          {{ identity | statusType(genderTypes) }}
        </template>
      </span>
      <span slot="days" slot-scope="days">
        <template>
          {{ days | isEmpty(false) }}
        </template>
      </span>
      <span slot="message" slot-scope="message">
        <template>
          {{ message | isEmpty(true) }}
        </template>
      </span>

      <span slot="forbiddenTime" slot-scope="text, record">
        <template>
          {{record.startTime | isEmpty(true)  }} ~ {{record.endTime | isEmpty(true) }}
        </template>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="red" @click="handleDelete(record)" v-has="{ perm: 'role:delete' }"
            >解封</a-tag
          >
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { getList,cancel,put } from "@/api/system/forbiddenManager";
import { STable } from "@/components";
import { dataStatus, dataTypes,genderTypes } from "@/config/serverstatus";
export default {
  name: "fenghList",
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
      dataStatus,
      dataTypes,
      genderTypes,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      rangeValue: [],
      selectRangeValue:"",
      // 表头
      columns: [
        {
          title: "用户ID",
          dataIndex: "digitId",
          width: "120px",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "昵称",
          dataIndex: "nick",
          width: "180px",
          scopedSlots: { customRender: "nick" },
        },
        {
          title: "身份",
          dataIndex: "identity",
          width: "100px",
          customRender: (text) => {
             return text === 1 ? "主播" : "用户";
           },
        },
        // {
         // title: "封号时间",
         // dataIndex: "forbiddenTime",
         // sorter: true,
          //width: "400px",
          //needTotal: false,
         // scopedSlots: { customRender: "forbiddenTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // },
      //},
         {
          title: "封号时间",
          dataIndex: "startTime",
          sorter: true,
          width: "180px",
          needTotal: false,
          scopedSlots: { customRender: "startTime" },
        },
        //endTime
        {
          title: "解封时间",
          dataIndex: "endTime",
          width: "400px",
          scopedSlots: { customRender: "endTime" },
        },
        {
          title: "备注",
          dataIndex: "message",
          scopedSlots: { customRender: "message" },
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
        console.log(Object.assign(parameter, this.queryParam));
        return getList(Object.assign(parameter, this.queryParam))
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
            //  res.rows = response.data;
            //临时数据
            // let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
            res.rows = response.data;
            console.log(response.data)
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
    },
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "解除封禁",
        content: (h) => (
          <div style="color:#000; font-size:15px;">
            确定要解除用户“{record.nick}”的封禁吗？
          </div>
        ),
        onOk() {
          cancel({forbiddenId:record.id })
            .then(response => {
              if (response.code === 0) that.$message.info("操作成功!");
              else that.$message.error(response.message);
              that.$refs.table.refresh();
            })
            .catch(response => {
              that.$message.warn(response.data.message);
            });
        },
        onCancel() {},
      });
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
