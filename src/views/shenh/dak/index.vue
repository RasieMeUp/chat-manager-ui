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
            <a-form-item label="账户类型">
              <a-select v-model="queryParam.type">
                <a-select-option :value="0"> 支付宝 </a-select-option>
                <a-select-option :value="1"> 银行卡 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="提现时间">
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
      <span slot="payActual" slot-scope="payActual">
        <template>
          {{ payActual | isEmpty(false) }}
        </template>
      </span>
      <span slot="payType" slot-scope="payType">
        <template>
          {{ payType | isEmpty(true) }}
        </template>
      </span>
      <span slot="payToPeople" slot-scope="payToPeople">
        <template>
          {{ payToPeople | isEmpty(true) }}
        </template>
      </span>
      <span slot="payToAccount" slot-scope="payToAccount">
        <template>
          {{ payToAccount | isEmpty(true) }}
        </template>
      </span>
      <span slot="createTime" slot-scope="createTime">
        <template>
          {{ createTime | isEmpty(true) }}
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="red" @click="handleConfirm(record)" v-has="{ perm: 'role:delete' }"
            >打款</a-tag
          >
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { getPayList, payHandle } from "@/api/system/withdrawManager";
import { STable } from "@/components";
export default {
  name: "dakList",
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
          scopedSlots: { customRender: "orderNumber" },
        },
        {
          title: "用户ID",
          sorter: true,
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "昵称",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },
        {
          title: "打款金额（元）",
          sorter: true,
          dataIndex: "payActual",
          scopedSlots: { customRender: "payActual" },
        },
        {
          title: "账户类型",
          sorter: true,
          dataIndex: "payType",
          scopedSlots: { customRender: "payType" },
        },
        {
          title: "收款人",
          dataIndex: "payToPeople",
          scopedSlots: { customRender: "payToPeople" },
        },
        {
          title: "账号",
          dataIndex: "payToAccount",
          scopedSlots: { customRender: "payToAccount" },
        },
        {
          title: "申请时间",
          dataIndex: "createTime",
          sorter: true,
          needTotal: false,
          scopedSlots: { customRender: "createTime" },
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
        return getPayList(Object.assign(parameter, this.queryParam)).then((response) => {
          console.log("dak== getpaylist ==>", response);
          let res = {
            // hasNext: true,
            pageCount: response.extra.totalPage,
            pageIndex: response.extra.currPage,
            pageSize: 10,
            total: response.extra.totalEle,
            rows: [],
          };
          res.rows = response.data;
          //临时数据
          // res.rows = [
          //   {
          //     createTime: "2020-12-17T06:13:02.972Z",
          //     digitId: "10245646",
          //     nick: "姓名",
          //     orderNumber: "123459",
          //     payActual: 0,
          //     payToAccount: "收款账号",
          //     payToPeople: "收款人23164165",
          //     payType: 0,
          //     remark: "string",
          //   },
          // ];
          return res;
        });
      },
    };
  },
  created() {
    // this.loadData(this.queryParam);
    this.setStartValue();
  },
  filters: {
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
    handleConfirm(record) {
      const that = this;
      this.$confirm({
        title: "打款确定",
        content: (h) => (
          <div style="color:#000; font-size:15px;">
            已向下方账户汇款：
            <span style="font-weight:bold; font-size:18px;">{record.payActual}元</span>
            <br />
            账户类型：{record.payType == 0 ? "支付宝" : "银行卡"}
            <br />
            收款人：{record.payToPeople}
            <br />
            账号：{record.payToAccount}
          </div>
        ),
        okType: "danger",
        onOk() {
          payHandle({ operate: 1, orderNumber: record.orderNumber })
            .then((response) => {
              if (response.success) that.$message.info("操作成功!");
              else that.$message.error(response.message);
              that.$refs.table.refresh();
            })
            .catch((response) => {
              console.log(response.message);
              // that.$message.warn(response.message);
            });
        },
        onCancel() {},
      });
    },
    handleOk() {
      this.$refs.table.refresh();
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
