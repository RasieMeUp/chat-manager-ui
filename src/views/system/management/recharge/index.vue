<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      :rowKey="record => record.id"
      :columns="columns"
      :data="loadData"
    >

      <span slot="ids" slot-scope="text, record">
        <template>
          {{ record.skuId | isEmpty(true) }}
        </template>
      </span>
      <!-- 充值聊币 -->
      <span slot="coins" slot-scope="text, record">
        <template>
            <span v-if="record.id==rowId">
<a-input v-model="queryParam.coin" style="width:150px"  
                           placeholder />     
            </span>
            <span v-else> {{ record.coin | isEmpty(true) }}</span>
         
        </template>
      </span>

<!-- 原价 -->
      <span slot="originPrices" slot-scope="text, record">
          <template>   
 <span v-if="record.id==rowId">
<a-input v-model="queryParam.originPrice" style="width:150px"  
                           placeholder />     
        </span>
        <span v-else> {{ record.originPrice | isEmpty(true) }}</span>
    </template>
      </span>


<!-- 折扣价 -->
      <span slot="disountPrices" slot-scope="text, record">
        <template>   
 <span v-if="record.id==rowId">
<a-input v-model="queryParam.disountPrice" style="width:150px"  
                           placeholder />     
        </span>
        <span v-else> {{ record.disountPrice | isEmpty(true) }}</span>
    </template>
      </span>
      <!-- 折扣 -->
      <span slot="discountPercents" slot-scope="text, record">
        <!-- <template>
          {{ discountPercent | isEmpty(true) }}
        </template> -->
          <template>   
 <span v-if="record.id==rowId">
<a-input v-model="queryParam.discountPercent" style="width:150px"  
                           placeholder />     
        </span>
        <span v-else> {{ record.discountPercent | isEmpty(true) }}</span>
    </template>
      </span>
      <!-- 操作 -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="red" @click="handleEdit(record)" v-has="{ perm: 'role:delete' }"
            >编辑</a-tag>
            <a-tag color="red" @click="handLeSave(record)" v-has="{ perm: 'role:delete' }"
            >保存</a-tag>
            <a-tag color="red" @click="handelDelete(record)" v-has="{ perm: 'role:delete' }"
            >删除</a-tag>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { paymentList,updateSkuPayment ,deleteSuk} from "@/api/system/management/paramter";
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
     rowId:"",
      selectRangeValue:"",
        queryParam: {},
      // 表头
      columns: [
        {
          title: "序号",
          sorter: true,
          dataIndex: "skuId",
          scopedSlots: { customRender: "ids" },
        },
        {
          title: "充值聊币",
          sorter: true,
          dataIndex: "coin",
          scopedSlots: { customRender: "coins" },
        },
        {
          title: "原价",
          dataIndex: "originPrice",
          scopedSlots: { customRender: "originPrices" },
        },
        {
          title: "折扣价）",
          sorter: true,
          dataIndex: "disountPrice",
          scopedSlots: { customRender: "disountPrices" },
        },
        {
          title: "折扣",
          sorter: true,
          dataIndex: "discountPercent",
          scopedSlots: { customRender: "discountPercents" },
        },
       
        {
          title: "操作", //审核  空
          dataIndex: "action",
          width: "200px",
          scopedSlots: { customRender: "action" },
        },
        
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return  paymentList().then((response) => {
          console.log("dak== paymentList ==>", response);
          this.userCount = 100;
          let res = {
            // hasNext: true,
            pageCount: 30,
            pageIndex: 1,
            pageSize: 10,
            total: 10,
            rows: [],
          };

          res.rows = response.data.cnyCoins;
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


    handleEdit(record) {
      const that = this;
      this.rowId=record.id
      this.queryParam.coin=record.coin
      this.queryParam.originPrice=record.originPrice
      this.queryParam.disountPrice=record.disountPrice
      this.queryParam.discountPercent=record.discountPercent
     
    },
    handLeSave(record){
         updateSkuPayment({
          skuId: record.skuId,
        coin: this.queryParam.coin,
        originPrice: this.queryParam.originPrice,
        discountPrice: this.queryParam.disountPrice,
        discountPercent:this.queryParam.discountPercent,
         }).then((response) => {
            that.$message.info("操作成功");
              that.$refs.table.refresh();
        });
    },
    handelDelete(record){
        deleteSuk({
          skuId: record.skuId,
         }).then((response) => {
            that.$message.info("操作成功");
              that.$refs.table.refresh();
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
