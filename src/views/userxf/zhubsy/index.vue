<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
         <a-col :md="6" :sm="24">
            <a-form-item label="主播ID">
              <a-input v-model="queryParam.digitId" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="主播昵称">
              <a-input v-model="queryParam.nick" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="开始时间">
               <a-range-picker @change="rangeOnChange" @calendarChange="calendarPriceRangeChange" :value="rangeValue"  :disabled-date="disabledPriceRangeDate"   />
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

    <div class="ul-list">
      <span>总收益  ：<em>{{totalProfit  | isEmpty(false)}}</em>聊币</span>
      <span>视频收益：<em>{{videoProfit | isEmpty(false)}}</em>聊币</span>
      <span>语音收益：<em>{{voiceProfit | isEmpty(false)}}</em>聊币</span>
      <span>私信收益：<em>{{msgProfit | isEmpty(false)}}</em>聊币</span>
      <span>礼物收益：<em>{{giftProfit | isEmpty(false)}}</em>聊币</span>
    </div>

    <a-radio-group v-model="type" :style="{ marginBottom: '8px' }" @change="radioChange" >
      <a-radio-button :value="1"> 视频</a-radio-button>
      <a-radio-button :value="0"> 语音 </a-radio-button>
      <a-radio-button :value="2"> 私信 </a-radio-button>
      <a-radio-button :value="3"> 礼物 </a-radio-button>
    </a-radio-group>

    
     <s-table
      ref="table"
      
      size="default"
      :columns="type==0 ? columnsAudio :columns "
      :data="loadData"
      :scroll="{ x: '100%' }"
    >
    <!-- :rowKey="record => record.createTime" -->
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
       <span slot="createTime" slot-scope="createTime">
        <template>
          {{ createTime | isEmpty(true) }}
        </template>
      </span>

      <span slot="duration" slot-scope="duration">
        <template>
          {{ duration | secondToDate(false) }}
        </template>
      </span>

       <span slot="card" slot-scope="card">
        <template>
          {{ card | isEmpty(false) }}
        </template>
      </span>

      <span slot="profit" slot-scope="profit">
        <template>
          {{ profit | isEmpty(false) }}
        </template>
      </span>

      

    </s-table>
<s-table
      ref="table2"
      :rowKey="record => record.createTime"
      size="default"
      :columns="columnsMsg"
      :data="loadDataMsg"
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
       <span slot="createTime" slot-scope="createTime">
        <template>
          {{ createTime | isEmpty(true) }}
        </template>
      </span>

       <span slot="phone" slot-scope="phone">
        <template>
          {{ phone | isEmpty(true) }}
        </template>
      </span>

      <span slot="profit" slot-scope="profit">
        <template>
          {{ profit | isEmpty(false) }}
        </template>
      </span>

    </s-table>


    <s-table
      ref="table3"
      :rowKey="record => record.createTime"
      size="default"
      :columns="columnsGift"
      :data="loadDataGift"
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
       <span slot="createTime" slot-scope="createTime">
        <template>
          {{ createTime | isEmpty(true) }}
        </template>
      </span>

       <span slot="phone" slot-scope="phone">
        <template>
          {{ phone | isEmpty(true) }}
        </template>
      </span>

      <span slot="profit" slot-scope="profit">
        <template>
          {{ profit | isEmpty(false) }}
        </template>
      </span>

    </s-table>

  </a-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { getAnchorCall,getAnchorGift,getAnchorMsg } from "@/api/system/profitManager";
import { STable } from "@/components";
export default {
  name: "zhubsyList",
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
      totalProfit:null,
      videoProfit:null,
      voiceProfit:null,
      msgProfit:null,
      giftProfit:null,
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
          title: "主播ID",
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "主播昵称",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },
        {
          title: "时长(时分秒)",
          dataIndex: "duration",
        scopedSlots: { customRender: "duration" },
        },
        {
          title: "收益（聊币）",
          dataIndex: "profit",
        scopedSlots: { customRender: "profit" },
        },
        {
        title: "视频卡",
        dataIndex: "card",
        scopedSlots: { customRender: "card" },
        },
        {
          title: "开始时间",
          dataIndex: "createTime",
          needTotal: false,
          scopedSlots: { customRender: "createTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // }
        },
      ],
       // 语音表头
      columnsAudio: [
        {
          title: "主播ID",
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "主播昵称",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },
        {
          title: "时长(时分秒)",
          dataIndex: "duration",
        scopedSlots: { customRender: "duration" },
        },
        {
          title: "收益（聊币）",
          dataIndex: "profit",
        scopedSlots: { customRender: "profit" },
        },
        {
          title: "语音卡",
          dataIndex: "card",
          scopedSlots: { customRender: "card" },
        },
        {
          title: "开始时间",
          dataIndex: "createTime",
          needTotal: false,
          scopedSlots: { customRender: "createTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // }
        },
      ],
         //私信表头
        columnsMsg: [
        {
          title: "主播ID",
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "主播昵称",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },
        {
          title: "收益（聊币）",
          dataIndex: "profit",
        scopedSlots: { customRender: "profit" },
        },
         {
          title: "聊天券",
          dataIndex: "card",
        scopedSlots: { customRender: "card" },
        },
        {
          title: "开始时间",
          dataIndex: "createTime",
          needTotal: false,
          scopedSlots: { customRender: "createTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // }
        }],
        //礼物表头
        columnsGift: [
        {
          title: "主播ID",
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "主播昵称",
          dataIndex: "nick",
          scopedSlots: { customRender: "nick" },
        },{
          title: "礼物名称",
          dataIndex: "giftName",
        scopedSlots: { customRender: "giftName" },
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
          scopedSlots: { customRender: "createTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD hh:ss:mm");
          // }
        }
      ],
      loadDataMsg: (parameter) => {
        return getAnchorMsg(Object.assign(parameter, this.queryParam))
                    .then((response) => {
                      console.log("zhub msg==>", response);
                      let res = {
              // hasNext: true,
              pageCount: response.extra.totalPage,
              pageIndex: response.extra.currPage,
              pageSize: 10,
              total: response.extra.totalEle,
              rows: []
            };
             this.totalProfit=response.extra.totalProfit;
            this.videoProfit=response.extra.videoProfit;
            this.voiceProfit=response.extra.voiceProfit;
            this.msgProfit=response.extra.msgProfit;
            this.giftProfit=response.extra.giftProfit;
              res.rows = response.data;
            return res;
                    })
                    .catch((response) => {
                    this.$message.warn(response.message);
                    });
      },
      loadDataGift: (parameter) => {
        return getAnchorGift(Object.assign(parameter, this.queryParam))
                    .then((response) => {
                      console.log("zhub getAnchorGift==>", response);
                      let res = {
              // hasNext: true,
              pageCount: response.extra.totalPage,
              pageIndex: response.extra.currPage,
              pageSize: 10,
              total: response.extra.totalEle,
              rows: []
            };
             this.totalProfit=response.extra.totalProfit;
            this.videoProfit=response.extra.videoProfit;
            this.voiceProfit=response.extra.voiceProfit;
            this.msgProfit=response.extra.msgProfit;
            this.giftProfit=response.extra.giftProfit;
                   res.rows = response.data;
            return res;
                    })
                    .catch((response) => {
                    this.$message.warn(response.message);
                    });
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
            let typelist = { type: this.type };
                  return getAnchorCall(Object.assign(parameter, this.queryParam, typelist))
                    .then((response) => {
                    console.log("zhub call==>", response);
                    let res = {
              // hasNext: true,
              pageCount: response.extra.totalPage,
              pageIndex: response.extra.currPage,
              pageSize: 10,
              total: response.extra.totalEle,
              rows: []
            };
            this.totalProfit=response.extra.totalProfit;
            this.videoProfit=response.extra.videoProfit;
            this.voiceProfit=response.extra.voiceProfit;
            this.msgProfit=response.extra.msgProfit;
            this.giftProfit=response.extra.giftProfit;
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
    this.setStartValue();
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
      this.queryParam.startTime =moment(myDate).format("YYYY-MM-DD")+' 00:00:00';
      this.queryParam.endTime =moment(myDate).format("YYYY-MM-DD")+' 23:59:59';
      this.rangeValue = [ moment(myDate).format("YYYY-MM-DD"), moment(myDate).format("YYYY-MM-DD")];
      setTimeout(() => {
         this.setDisplay();
      }, 100);
    },
    setDisplay(){
          switch(this.type){
                case 2:
                  this.$refs.table2.$el.style.display = 'block';
                  this.$refs.table3.$el.style.display = 'none';
                  this.$refs.table.$el.style.display = 'none';
                  break;
                case 3:
                  this.$refs.table3.$el.style.display = 'block';
                  this.$refs.table.$el.style.display = 'none';
                  this.$refs.table2.$el.style.display = 'none';
                  break;
                default:
                  this.$refs.table.$el.style.display = 'block';
                  this.$refs.table2.$el.style.display = 'none';
                  this.$refs.table3.$el.style.display = 'none';
                  break;
            }
    },
    add(data,type){
      this.type =type;
      this.queryParam.digitId = data.digitId;
      this.queryParam.nick = data.nick;
      this.loadData(this.queryParam);
    },
    radioChange(e){
      console.log('radio1 checked', e.target.value);
      this.type = e.target.value;
      this.setDisplay();
      switch(this.type){
          case 2:
            this.loadDataMsg(this.queryParam);
            break;
          case 3:
            this.loadDataGift(this.queryParam);
            break;
          default:
            this.loadData(this.queryParam);
            break;
      }
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
      // this.$refs.table.refresh();
       switch(this.type){
          case 2:
            this.$refs.table2.refresh();
            break;
          case 3:
            this.$refs.table3.refresh();
            break;
          default:
            this.$refs.table.refresh();
            break;
      }
    },
    callback(key) {
      console.log(key);
    },
    searchForm() {
      console.log('searchform  type==',this.type);
      switch(this.type){
          case 2:
            this.$refs.table2.refresh(true);
            break;
          case 3:
            this.$refs.table3.refresh(true);
            break;
          default:
            this.$refs.table.refresh(true);
            break;
      }
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
