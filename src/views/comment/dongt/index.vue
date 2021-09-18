<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="动态ID">
              <a-input v-model="queryParam.id" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="用户ID">
              <a-input v-model="queryParam.digitId" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="用户昵称">
              <a-input v-model="queryParam.nick" placeholder="" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
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
          <a-col :md="6" :sm="24">
            <a-form-item label="动态内容">
              <a-input v-model="queryParam.content" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="发布时间">
               <a-range-picker @change="rangeOnChange" @calendarChange="calendarPriceRangeChange" :value="rangeValue"  :disabled-date="disabledPriceRangeDate"   />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParam.type">
                <a-select-option :value="1"> 机审通过 </a-select-option>
                <a-select-option :value="2"> 人工审核通过 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-if="false">
            <a-button type="dashed" @click="tableOption"
              >{{ (optionAlertShow && "关闭") || "开启" }} 批量操作</a-button
            >  
            <a-dropdown
              v-action:edit
              v-if="selectedRowKeys.length > 0"
              v-has="{ perm: 'news:batch' }"
            >
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="handleOpera(-1)">
                  <a-icon type="delete" />删除
                </a-menu-item>
                <a-menu-item key="2" @click="handleOpera(1)">
                  <a-icon type="lock" />隐藏
                </a-menu-item>
                <a-menu-item key="3" @click="handleOpera(0)">
                  <a-icon type="unlock" />解除隐藏
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                批量操作
                <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="ul-list">
      <span>动态数：<em>无字段……</em>人</span>
      <span>浏览次数：<em>无字段……</em></span>
      <span>评论数：<em>无字段……</em></span>
    </div>
    <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }" @change="radioChange">
      <a-radio-button :value="0"> 全部 </a-radio-button>
       <a-radio-button :value="1"> 动态审核 </a-radio-button>
      <!-- <a-radio-button :value="2"> 隐藏 </a-radio-button> -->
    </a-radio-group>
    
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :scroll="{ x: 800 }"
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

      <span slot="content" slot-scope="content">
        <template>
          {{ content | isEmpty(true) }}
        </template>
      </span>
       <span slot="videoPhoto"  slot-scope="text, record">
        <template>
           <a-tag  color="orange" @click="openImgWindows(record)">查看</a-tag>
        </template>
      </span>
      <span slot="commentCount" slot-scope="commentCount">
        <template>
          {{ commentCount | isEmpty(false) }}
        </template>
      </span>
      <span slot="heartCount" slot-scope="heartCount">
        <template>
          {{ heartCount | isEmpty(false) }}
        </template>
      </span>
       <span slot="creatTime" slot-scope="creatTime">
        <template>
          {{ creatTime | isEmpty(true) }}
        </template>
      </span>
       <span slot="status" slot-scope="status">
        <template>
           {{ status | statusType(dyamicAuditTypes) }}
        </template>
      </span>
       <span slot="status" slot-scope="status">
        <template>
           {{ status | statusType(dynamicDTType) }}
        </template>
      </span>

      <span slot="message" slot-scope="message">
        <template>
          {{ message | isEmpty(true) }}
        </template>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="auditHandle(record, '动态审核')" hidden
            >人工审核</a-tag
          >
        <a-tag color="red" @click="handleSeal(record)"
            >修改</a-tag
          >
          <a-tag color="red" @click="handleDelete(record)"
            >隐藏</a-tag
          >
        </template>
      </span>
    </s-table>


    <s-table
      ref="table2"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData1"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :scroll="{ x: 800 }"
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

      <span slot="content" slot-scope="content">
        <template>
          {{ content | isEmpty(true) }}
        </template>
      </span>
       <span slot="videoPhoto"  slot-scope="text, record">
        <template>
           <a-tag  color="orange" @click="openImgWindows(record)">查看</a-tag>
        </template>
      </span>
      <span slot="commentCount" slot-scope="commentCount">
        <template>
          {{ commentCount | isEmpty(false) }}
        </template>
      </span>
      <span slot="heartCount" slot-scope="heartCount">
        <template>
          {{ heartCount | isEmpty(false) }}
        </template>
      </span>
       <span slot="creatTime" slot-scope="creatTime">
        <template>
          {{ creatTime | isEmpty(true) }}
        </template>
      </span>
       <span slot="status" slot-scope="status">
        <template>
           {{ status | statusType(dyamicAuditTypes) }}
        </template>
      </span>

      <span slot="message" slot-scope="message">
        <template>
          {{ message | isEmpty(true) }}
        </template>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="auditHandle(record, '动态审核')"
            >人工审核</a-tag
          >
          <!-- <a-tag color="red" @click="handleSeal(record)"
            >修改</a-tag
          > -->
          <a-tag color="red" @click="handleDelete(record)"
            >隐藏</a-tag
          >
        </template>
      </span>
    </s-table>






    <a-modal
      :title="shModalT"
      :visible="shModal"
      :confirm-loading="false"
      ok-text="审核通过"
      cancel-text="审核不通过"
      :footer="null"
      @cancel="shHandleCancel"
      width="500px"
    >
      <div style="text-align: center; padding: 0px 0 0 0">
        <div style="padding-bottom:20px; text-align:left;">备注：<a-input v-model="desc"  type="textarea" placeholder="请填写备注信息" /></div>
      </div>
       <div>
        <a-button
          type="primary"
          size="default"
          @click="shHandleOk(1,0)"
          style="margin:0 5px 0 0;background:#23D96E; border:1px solid #15BC58;"
        >发布为动态
        </a-button>
         <a-button v-if="identity ==1"
          type="primary"
          size="default"
          @click="shHandleOk(1,1)"
          style="margin-right: 5px"
        >发布为守护动态
        </a-button>
        <a-button type="danger" size="default" @click="shHandleOk(0)">
          审核不通过
        </a-button>
        </div>
    </a-modal>





    <a-modal
      title
      :visible="imgModal"
      :confirm-loading="false"
      :footer="null"
      @cancel="handleCancel"
    >
      <p>
        <img class="photo-img" :src="imgModalUrl" style="width: 100%" />
      </p>


    </a-modal>



    <a-modal
      title
      :visible="imgsModal"
      :confirm-loading="false"
      :footer="null"
      @cancel="handlePhotoCancel"
    >
            <a-row :gutter="[10, { xs: 8, sm: 16, md: 5, lg: 10 }]">
              <a-col
                :span="8"
                v-for="(photoUrl, index) in pictureUrlList"
                :key="index"
                @click="openBigImg(pictureUrlList[index])"
              >
                <div class="photo-li">
                  <a-avatar
                    shape="square"
                    :size="90"
                    :src="photoUrl"
                    @click="openBigImg(photoUrl)"
                  />
                </div>
              </a-col>
            </a-row>

    </a-modal>




    <a-modal
      title
      :visible="videoModal"
      :confirm-loading="false"
      :footer="null"
      :width="500"
      @cancel="handleCancel"
    >
      <video
        class="video-box"
        id="demoVideo"
        style="width: 100%"
        controls="true"
        enable-progress-gesture="true"
        show-center-play-btn="true"
        :src="videoUrl"
      ></video>
    </a-modal>








    <form-handle-seal ref="formHandleSeal" @ok="handleOk" />




  </a-card>
</template>

<script>
import moment from "moment";
import { page, delByPk, batch } from "@/api/news";
import { getAnchor } from "@/api/system/userManager";
import { list,del,guardList,audit } from "@/api/system/dynamic";
import { STable } from "@/components";
import formHandleSeal from "./edit";
import { guardChange} from "@/api/system/dynamic";
import { dyamicTypes ,dyamicAuditTypes,dynamicDTType} from "@/config/serverstatus";
export default {
  name: "dongtList",
  components: {
    STable,
    formHandleSeal,
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      handleOk: false,
      dynamicId:null,
      type:0,
      dyamicTypes,
      dyamicAuditTypes,
      dynamicDTType,
      imgsModal:false,
      imgModal: false,
      imgModalUrl: "",
      videoModal: false,
      videoUrl:null,
      pictureUrlList:null,

      shModal: false,
      shModalT: "",
      identity:"",
      mode: "top",
      advanced: false,
      optionAlertShow: true,
      rangeValue: [],
      selectRangeValue:"",
      queryParam: {},
      // 传值参数
      pageParam: {},
      desc: "",
      columns: [
        {
          title: "动态ID",
          dataIndex: "id",
          width: "120px",
          scopedSlots: { customRender: "id" },
        },
        {
          title: "用户ID",
          dataIndex: "digitId",
           width: "150px",
          scopedSlots: { customRender: "digitId" },
        },
          {
          title: "用户身份",
          dataIndex: "identity",
           width: "150px",
          scopedSlots: { customRender: "identity" },
           customRender: (text) => {
            return text === 0 ? "普通用户" : "主播";
           },
        },
        {
          title: "昵称",
          dataIndex: "nick",
           width: "150px",
          scopedSlots: { customRender: "nick" },
        },
       
         {
          title: "动态类型",
          dataIndex: "type",
           width: "150px",
          scopedSlots: { customRender: "type" },
            customRender: (text) => {
            return text >= 20 ? "守护动态" : "普通动态";
           },
        },
        {
          title: "动态内容",
          dataIndex: "content",
           width: "250px",
          scopedSlots: { customRender: "content" },
        },

        {
          title: "视频/图片",
          dataIndex: "videoPhoto",
          width: "120px",
          scopedSlots: { customRender: "videoPhoto" },
        },
        // {
        //   title: "浏览",
        //   dataIndex: "nick",
        //   scopedSlots: { customRender: "nick" },
        // },
       // {
         // title: "评论",
         //  width: "180px",
         // dataIndex: "commentCount",
         // scopedSlots: { customRender: "commentCount" },
      // },
        // {
        //   title: "点赞",
        //    width: "120px",
        //   dataIndex: "heartCount",
        //   scopedSlots: { customRender: "heartCount" },
        // },

        {
          title: "发布时间",
          dataIndex: "createTime",
           width: "250px",
          scopedSlots: { customRender: "createTime" },
          // customRender: (text) => {
          //   if (text) return moment(text).format("YYYY-MM-DD");
          // },
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
           width: "150px",
          // customRender: (text) => {
          //   return text === 1 ? "隐藏" : "正常";
          // },
        },
         {
          title: "备注",
          dataIndex: "message",
          scopedSlots: { customRender: "message" },
           width: "180px",
          // customRender: (text) => {
          //   return text === 1 ? "隐藏" : "正常";
          // },
        },
        {  
          title: "操作",
          dataIndex: "action",
          width: "250px",
          scopedSlots: { customRender: "action" },
          fixed: "right",
        },
      ],
      loadData: (parameter) => {
        console.log(Object.assign(parameter, this.queryParam));
        let typelist = { type: this.type };
        return list(Object.assign(parameter, this.queryParam,typelist)).then((response) => {
          console.log("动态列表==>", response);
          let res = {
            // hasNext: true,
            pageCount: response.extra.totalPage,
            pageIndex: response.extra.currPage,
            pageSize: 10,
            total: response.extra.totalEle,
            rows: [],
            userCount:response.extra.userCount,
          };
          this.userCount = response.extra.userCount;
          // //临时数据
          // let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
          res.rows = response.data;
          return res;
          // return response.res;
        });
      },
      loadData1: (parameter) => {
        console.log(Object.assign(parameter, this.queryParam));
        let typelist = { type: this.type };
        return guardList(Object.assign(parameter, this.queryParam)).then((response) => {
          console.log("守护动态列表==>", response);
          let res = {
            // hasNext: true,
            pageCount: response.extra.totalPage,
            pageIndex: response.extra.currPage,
            pageSize: 10,
            total: response.extra.totalEle,
            rows: [],
            userCount:response.extra.userCount,
          };

          this.userCount = response.extra.userCount;
          // //临时数据
          // let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
          res.rows = response.data;
         
          return res;
          // return response.res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = [];
          },
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
        },
      },
    };
  },
  created() {
    this.tableOption();
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
                case 1:
                  this.$refs.table2.$el.style.display = 'block';
                  this.$refs.table.$el.style.display = 'none';
                  break;
                default:
                  this.$refs.table.$el.style.display = 'block';
                  this.$refs.table2.$el.style.display = 'none';
                  break;
            }
    },
    radioChange(e) {
      this.type = e.target.value;
      this.setDisplay();
      switch(this.type){
          case 1:
            this.loadData1(this.queryParam);
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
    callback(key) {
      console.log(key);
    },
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = [];
            },
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
          },
        };
        this.optionAlertShow = true;
      } else {
        this.options = {
          alert: false,
          rowSelection: null,
        };
        this.optionAlertShow = false;
      }
    },
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要隐藏吗?",
        onOk() {
          del({ dynamicId : record.id })
            .then((response) => {
              if(response.code==0){
               that.$message.info('操作成功');
              that.$refs.table.refresh();
              }else{
                 that.$message.error(response.message);
              that.$refs.table.refresh();
              }
            })
            .catch((response) => {
              that.$message.warn(response.message);
            });
        },
        onCancel() {},
      });
    },
    handleOk() {
      this.$refs.table.refresh();
    },
    searchForm() {
      switch(this.type){
          case 1:
            this.$refs.table2.refresh(true);
            break;
          default:
            this.$refs.table.refresh(true);
            break;
      }
    },
    resetSearchForm() {
      this.queryParam = {};
      this.setStartValue();
      this.handleOk();
    },

    handleOpera(type) {
      const that = this;
      that.$confirm({
        title: "操作提醒",
        content: "确定要操作" + that.selectedRowKeys.length + "条数据吗?",
        onOk() {
          batch({ status: type, ids: that.selectedRowKeys })
            .then((reponse) => {
              that.$message.info(reponse.msg);
              that.$refs.table.refresh();
              that.options.rowSelection.selectedRowKeys = [];
            })
            .catch(() => console.log("Oops errors!"));
        },
        onCancel() {},
      });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    auditHandle(pageParam, title) {
      this.pageParam =pageParam;
      this.dynamicId = pageParam.id;
      this.shModalT = title;
      this.identity=pageParam.identity
      this.shModal = true;
    },
    shHandleCancel() {
      this.shModal = false;
      this.desc = "";
    },
    shHandleOk(__id, __type = -1) {

      audit({
        dynamicId: this.dynamicId,
        pass: __id,
        message: this.desc,
      })
      .then((response) => {
          console.log("动态审核==>", response);
          if (response.success) { 
            if (__type !== -1) {
            guardChange({
              dynamicId: this.dynamicId,
              isGuard: __type,
            })
            .then((response) => {

            })
            .catch((err) => {

            })
          }


            this.$message.info("操作成功!");  this.searchForm()
            }
          else {this.$message.error(response.message);}
        })
        .then(() => {
          this.shModal = false;
        });




    },
    openBigVideo() {
      this.videoModal = true;
      // this.$refs.shenhvideo2.src = this.videoUrl;
    },
    openBigImg(__url) {
      this.imgModalUrl = __url;
      this.imgModal = true;
    },
    openImgWindows(record) {
      this.pictureUrlList =  record.pictureUrlList;
      this.videoUrl =  record.videoUrl;
     this.videoUrl == null ?   this.pictureUrlList.length == 0 ? this.$message.info("暂无视频图片资源") : this.imgsModal = true :this.openBigVideo() ;
    },
    handleCancel(e) {
      this.imgModal = false;
      this.videoModal = false;
    },
    handlePhotoCancel(e){
      this.imgsModal = false;
    },
    
//主播才能发布守护动态
     handleSeal(record) {
       //console.log(record.id)
      this.$refs.formHandleSeal.add(record.id,record.identity);
    },
  },
  watch: {
    $route(cur, old) {
      this.$nextTick(() => {
        this.$refs.table.refresh(true);
      });
    },
  },
};
</script>
