<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>昨日</a>
              <a>近七天</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" />
              <a style="padding:0 0 0 20px;">查看更多&gt;</a>
          </div>
          <a-tab-pane  loading="true" tab="实时数据" key="1">
            <a-row :gutter="24" style="padding:0 20px;">
              <a-col :sm="24" :md="12" :xl="6"  :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="活跃人数>" total="313213">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">主播：</span>
                      313 
                    </trend>
                  </div>
                </chart-card>
              </a-col>
              <a-col  :sm="24" :md="12" :xl="6"  :style="{ marginBottom: '24px' }">
                <chart-card class="index-li" :loading="loading" title="视频通话人数>" :total="1303 | NumberFormat">
                  <a-tooltip title="视频通话人数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                   <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">通话房间数：</span>
                      313 
                    </trend>
                  </div>
                </chart-card>
              </a-col>
              <a-col :sm="24" :md="12" :xl="6"  :style="{ marginBottom: '24px' }">
                <chart-card class="index-li" :loading="loading" title="语音通话人数>" :total="202 | NumberFormat">
                  <a-tooltip title="语音通话人数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">通话房间数：</span>
                      313 
                    </trend>
                  </div>
                </chart-card>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>



    <a-card  :style="{ marginTop: '24px' }" :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>昨日</a>
              <a>近七天</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" />
              <a style="padding:0 0 0 20px;">查看更多&gt;</a>
          </div>
          <a-tab-pane  loading="true" tab="平台收益>" key="1">
            <a-row :gutter="24" style="padding:0 20px;">
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="视频收益>" total="878,931聊币">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">主播收益：</span>
                      11,231,341聊币 
                    </trend>
                  </div>
                </chart-card>
              </a-col>
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="语音收益>" total="12,414聊币">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">主播收益：</span>
                      4,145,514聊币 
                    </trend>
                  </div>
                </chart-card>
              </a-col>
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="私信收益>" total="12,414聊币">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">主播收益：</span>
                      4,145,514聊币 
                    </trend>
                  </div>
                </chart-card>
              </a-col>
               <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="礼物收益>" total="12,414聊币">
                  <a-tooltip title="礼物收益" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">主播收益：</span>
                      4,145,514聊币 
                    </trend>
                  </div>
                </chart-card>
              </a-col>
             
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>



   <a-card  :style="{ marginTop: '24px' }" :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
           （截止到14点）
            <div class="extra-item">
              <a>今日</a>
              <a>昨日</a>
              <a>近七天</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" />
              <a style="padding:0 0 0 20px;">查看更多&gt;</a>
          </div>
          <a-tab-pane  loading="true" tab="用户数据>" key="1">
         
            <a-row :gutter="24" style="padding:0 20px;">
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="新注册人数>" total="1202">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">总数：</span>
                      24981
                    </trend>
                  </div>
                </chart-card>
              </a-col>

              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="新充值人数>" total="202">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">金额：</span>
                      24981元
                    </trend>
                  </div>
                </chart-card>
              </a-col>
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="新消费人数>" total="313">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">金额：</span>
                      3313元
                    </trend>
                  </div>
                </chart-card>
              </a-col>
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="新认证用户>" total="502">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">总数：</span>
                      14981
                    </trend>
                  </div>
                </chart-card>
              </a-col>

              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="总充值人数>" total="2313">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">金额：</span>
                      143313元
                    </trend>
                  </div>
                </chart-card>
              </a-col>

              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="总消费人数>" total="502">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">金额：</span>
                      15413元
                    </trend>
                  </div>
                </chart-card>
              </a-col>
              <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
                <chart-card  class="index-li"  :loading="loading" title="新主播用户>" total="502">
                  <a-tooltip title="登录的用户数" slot="action">
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                  <div>
                    <trend flag="up" style="margin-right: 16px">
                      <span slot="term">总数：</span>
                      14981
                    </trend>
                  </div>
                </chart-card>
              </a-col>
              
             
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>


  </div>
</template>

<script>
import moment from "moment";
import { ChartCard, MiniArea, MiniBar, MiniProgress, RankList, Bar, Trend, NumberInfo, MiniSmoothArea } from "@/components";
import { baseMixin } from "@/store/app-mixin";

const barData = [];
const barData2 = [];
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}

const rankList = [];
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: "白鹭岛 " + (i + 1) + " 号店",
    total: 1234.56 - i * 100,
  });
}

const searchUserData = [];
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, "days").format("YYYY-MM-DD"),
    y: Math.ceil(Math.random() * 10),
  });
}
const searchUserScale = [
  {
    dataKey: "x",
    alias: "时间",
  },
  {
    dataKey: "y",
    alias: "用户数",
    min: 0,
    max: 10,
  },
];

const searchTableColumns = [
  {
    dataIndex: "index",
    title: "排名",
    width: 90,
  },
  {
    dataIndex: "keyword",
    title: "搜索关键词",
  },
  {
    dataIndex: "count",
    title: "用户数",
  },
  {
    dataIndex: "range",
    title: "周涨幅",
    align: "right",
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: "range" },
  },
];
const searchData = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  });
}

const DataSet = require("@antv/data-set");

const sourceData = [
  { item: "家用电器", count: 32.2 },
  { item: "食用酒水", count: 21 },
  { item: "个护健康", count: 17 },
  { item: "服饰箱包", count: 13 },
  { item: "母婴产品", count: 9 },
  { item: "其他", count: 7.8 },
];

const pieScale = [
  {
    dataKey: "percent",
    min: 0,
    formatter: ".0%",
  },
];

const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: "percent",
  field: "count",
  dimension: "item",
  as: "percent",
});
const pieData = dv.rows;

export default {
  name: "Analysis",
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
  },
  data() {
    return {
      loading: true,
      rankList,

      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: "#fff",
        lineWidth: 1,
      },
    };
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading;
    }, 1000);
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
};
</script>

<style lang="less" scoped>

.index-li{border:1px solid #e8e8e8}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}


.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
