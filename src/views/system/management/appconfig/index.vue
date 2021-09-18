<template>


  <a-card :bordered="false">


      <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24" style="text-align: right">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="danger" @click="insertRow()">新增</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
     :rowKey="record => record.id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >

      <span slot="remarks" slot-scope="text, record">
        <template>
          {{ record.remark | isEmpty(true) }}
        </template>
      </span>


      <span slot="versions" slot-scope="text, record">
                 <template>   
        <span v-if="record.version=='' && editType=='insert'  ">
          <a-input v-model="queryParam.version" style="width:100px"   placeholder v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]" /> 
        </span>
        <span v-else> {{ record.version| isEmpty(true) }}</span>
    </template>
      </span>
      <!-- 生效星期 -->
      <span slot="weeks" slot-scope="text, record">
        <template>
            <span v-if="record.version==rowId && editType=='editor'">
                <a-select  mode="multiple"  v-model="queryParam.week"  style="width:150px" @change="selectWeeks" v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]">
                         <a-select-option v-for="(role, index) in weekList" :key="index" :value="role.value" >{{ role.name }}</a-select-option>
                </a-select>    
            </span>

            <span v-else-if="record.version=='' && editType=='insert' ">
                <a-select  mode="multiple"  v-model="queryParam.week"  style="width:150px" @change="selectWeeks" v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]">
                         <a-select-option v-for="(role, index) in weekList" :key="index" :value="role.value" >{{ role.name }}</a-select-option>
                </a-select>  
            </span>

            <span v-else> {{ record.week | isEmpty(true) }}</span>
         
        </template>
      </span>

<!-- 生效时段 -->
      <span slot="timeWeek" slot-scope="text, record">
          <template>   
               <span v-if="record.version==rowId  && editType=='editor' ">
                  <a-input v-model="queryParam.startTime" style="width:50px"   v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]" placeholder />   至
                  <a-input v-model="queryParam.endTime"   style="width:50px"   v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]" placeholder /> 
               </span>

                <span v-else-if=" record.version==''  && editType=='insert' ">
                  <a-input v-model="queryParam.startTime" style="width:50px"   v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]" placeholder />   至
                  <a-input v-model="queryParam.endTime"   style="width:50px"   v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]" placeholder /> 
               </span>

                 <span v-else> {{ record.startTime +"至"+  record.endTime| isEmpty(true) }}</span>
    </template>
      </span>


<!-- 是否收费 -->
      <span slot="vedioActualIsFees" slot-scope="text, record">
        <template>   
           <span v-if="record.version==rowId &&  editType=='editor' ">
                 <a-select  style="width:150px" @change="selectAucual" v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]">
                        <a-select-option :value="0"> 否 </a-select-option>
                        <a-select-option :value="1"> 是 </a-select-option>
                  </a-select>     
          </span>

           <span v-else-if="record.version==''  && editType=='insert' ">
                 <a-select  style="width:150px" @change="selectAucual" v-decorator="[ {rules: [{required: true,  message: '请选择'}]}]">
                        <a-select-option :value="0"> 否 </a-select-option>
                        <a-select-option :value="1"> 是 </a-select-option>
                  </a-select>     
          </span>
        <span v-else> {{ record.vedioActualIsFee==1 ? "是" : "否" | isEmpty(true) }}</span>
    </template>
      </span>
      <!-- 是否展示收费 -->
      <span slot="vedioViewIsFeeTimes" slot-scope="text, record">
          <template>            
                  <span v-if="record.version==rowId  && editType=='editor' ">
                     <a-select   v-decorator="['vedioViewIsFee', {rules: [{required: true,  message: '请选择'}]}]"  style="width:150px" @change="selectValue">
                        <a-select-option :value="0"> 否 </a-select-option>
                        <a-select-option :value="1"> 是 </a-select-option>
                      </a-select>     
                  </span>

                   <span v-else-if="record.version==''  && editType=='insert' ">
                     <a-select   v-decorator="['vedioViewIsFee', {rules: [{required: true,  message: '请选择'}]}]"  style="width:150px" @change="selectValue">
                        <a-select-option :value="0"> 否 </a-select-option>
                        <a-select-option :value="1"> 是 </a-select-option>
                      </a-select>     
                  </span>

                  
                 <span v-else> {{ record.vedioViewIsFee==1 ? "是" : "否" | isEmpty(true) }}</span>
    </template>
      </span>


           <!-- 是否骚扰 -->
      <span slot="harassIsStarts" slot-scope="text, record">
          <template>   
                <span v-if="record.version==rowId  && type=='editor'">
                     <a-select style="width:150px" @change="selectIsStart" v-decorator="['harassIsStart',  {rules: [{required: true,  message: '请选择'}]}]">
                                        <a-select-option :value="0"> 否 </a-select-option>
                                        <a-select-option :value="1"> 是 </a-select-option>
                     </a-select>     
                </span>

                 <span v-else-if="record.version==''  && editType=='insert'">
                     <a-select  v-decorator="['harassIsStart',  {rules: [{required: true,  message: '请选择'}]}]" style="width:150px" @change="selectIsStart">
                                        <a-select-option :value="0"> 否 </a-select-option>
                                        <a-select-option :value="1"> 是 </a-select-option>
                     </a-select>     
                </span>

               <span v-else> {{ record.harassIsStart==1 ? "是" : "否" | isEmpty(true) }}</span>
    </template>
      </span>


      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="red" @click="handleChange(record)" v-has="{ perm: 'news:delete' }"  v-if="record.version!=''"
            >编辑</a-tag
          >

           <a-tag color="red" @click="handleInsert(record)" v-has="{ perm: 'news:delete' }"
            >保存</a-tag
          >
        
           <a-tag color="red" @click="handleDelete(record)" v-has="{ perm: 'news:delete' }" v-if="record.version!=''"
            >删除</a-tag
          >
        </template>
      </span>
    </s-table>
  
  </a-card>

  
</template>

<script>//E:\space\chat-manager-ui\src\api\system\management\paramter\index.js
import moment from "moment";
import formHandle from "./handle";
import { page, delByPk, batch } from "@/api/news";
import { getListConfig,updateAppConfig,delCofig } from "@/api/system/management/paramter";
import { STable } from "@/components";
//import formHandle from '../appconfig/handle';
export default {
  name: "giftList",
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
         weekList:[
      {name:"周一", value:"2"},
      {name:"周二", value:"3"},
      {name:"周三", value:"4"},
      {name:"周四", value:"5"},
      {name:"周五", value:"6"},
      {name:"周六", value:"7"},
      {name:"周日", value:"1"},
    ],
      yesNoList:[
      {name:"否", value:"0"},
      {name:"是", value:"1"},
    ],

      type: 0,
      shModal: false,
      shModalT: "",
      advanced: false,
      optionAlertShow: false,
      queryParam: {},
      versionShow:false,
      formVedioViewIsFee:"",
      formVedioViewIsFee:"",
      formHarassIsStart:"",
      formVedioActualIsFees:"",
      formWeeks:"",
      rowId:"",
      editType:"editor",
      columns: [
     
        {
          title: "版本描述",
          dataIndex: "remark",
          scopedSlots: { customRender: "remarks" },
        },
        {
          title: "版本号",
          dataIndex: "version",
          scopedSlots: { customRender: "versions" },
        },
        {
          title: "生效星期",
          dataIndex: "week",
          width:"7rem",
          scopedSlots: { customRender: "weeks" },
        },

         {
          title: "生效时段",
          dataIndex: "timeWeek",
          scopedSlots: { customRender: "timeWeek" },
        },
       
        
         {
          title: "是否收费",
          dataIndex: "vedioActualIsFee",
         // scopedSlots: { customRender: "vedioActualIsFee" },
          scopedSlots: { customRender: "vedioActualIsFees" },
          //   customRender: (text) => {
          //   return text =1 ? "否" : "是";
          //  },
        },
        
        {
          title: "是否展示收费",
          dataIndex: "vedioViewIsFee",
          //scopedSlots: { customRender: "vedioViewIsFee" },
          scopedSlots: { customRender: "vedioViewIsFeeTimes" },
          //   customRender: (text) => {
          //   return text =1 ? "否" : "是";
          //  },
        },
         {
          title: "是否骚扰",
          dataIndex: "harassIsStart",
          scopedSlots: { customRender: "harassIsStarts" },
          //   customRender: (text) => {
          //   return text =1 ? "否" : "是";
          //  },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "180px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loadData: (parameter) => {
        return getListConfig().then((response) => {
          this.userCount = response.extra.userCount;
          //临时数据
          let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
          res.rows = response.data;
           this.rowId=response.data.version
          return res;
          return response.res;
        });
      },
     
      selectedRowKeys: [],
      selectedRows: [],
      harassIsStartVersion:"",
      vedioActualIsFeeVersion:"",
      vedioViewIsFeeVersion:"",
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
   // this.tableOption();
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
    versionClick(){
  this.versionShow=true
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
   
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要删除吗?",
        onOk() {
          delCofig({ version: record.version })
            .then((response) => {
              that.$message.info(response.message);
              that.$refs.table.refresh();
            })
            .catch((response) => {
              that.$message.warn(response.message);
            });
        },
        onCancel() {},
      });
    },

    handleChange(record){
       this.rowId="";
      this.rowId=record.version
        this.editType='editor'
      this.queryParam.week=record.week
      this.queryParam.startTime =record.startTime
      this.queryParam.endTime =record.endTime
       this.queryParam.harassIsStart=record.harassIsStart
      this.queryParam.versionStatus=record.versionStatus
      this.queryParam.vedioViewIsFee=record.vedioViewIsFee
     this.queryParam.vedioActualIsFee=record.vedioActualIsFee
    },
    handleOk() {
      this.$refs.table.refresh();
    },

    insertRow(){
      this.rowId="";
      this.editType='insert';
    this.$refs.table.localDataSource.push({
      channelId:"",
      dynamiChangeTime:"",
      dynamicIsSwitch:"",
      endTime:"",
      harassIsStart:"",
      isRegSendFreeVideo:"",
      name:"",
      startTime:"",
      timeWeek:"",
      vedioActualIsFee:"",
      vedioViewIsFee:"",
      version:"",
      versionStatus:"",
      week:"",
    })
    this.rowId="";
    this.editType='insert'
    console.log(this.type)
   //  this.loadData.push(list)
    },
    
    handleInsert(record,e){
      if(record.version!=null && record.version!=""){
            updateAppConfig({
              version: record.version,
              week: this.formWeeks,
              startTime: this.queryParam.startTime,
              endTime: this.queryParam.endTime,
              versionStatus: this.queryParam.versionStatus,
              vedioActualIsFee: this.formVedioActualIsFees,
              vedioViewIsFee: this.formVedioViewIsFee,
               harassIsStart: this.formHarassIsStart,
             }).then(response => {
               // console.log("编辑接口 updateUserProfileBase: ", response);
                if (response.code === 0) {
                  this.$message.info("资料修改成功！");
                     this.searchForm();
                } else {
                  this.$message.error(response.message);
                }
              });
      }else{
        if(this.queryParam.version==""){
          alert("请输入版本号");
          return false;

        }else if(this.formVedioActualIsFees==""){
           alert("请选择是否收费");
          return false;

        }else if(this.queryParam.startTime==""){
             alert("请输入生效开始时间");
          return false;
        }else if(this.queryParam.endTime==""){
             alert("请输入生效结束时间");
          return false;
        }
        else if(this.formVedioViewIsFee==""){
            alert("请选择是否展示收费");
          return false;

        } else if(this.formHarassIsStart==""){
            alert("请选择是否开启骚扰");
          return false;

        }else{
            updateAppConfig(
                {version: this.queryParam.version,
              week: this.formWeeks,
              startTime: this.queryParam.startTime,
              endTime: this.queryParam.endTime,
              versionStatus: 0,
              vedioActualIsFee: this.formVedioActualIsFees,
              vedioViewIsFee: this.formVedioViewIsFee,
               harassIsStart: this.formHarassIsStart,
             }).then(response => {
               // console.log("编辑接口 updateUserProfileBase: ", response);
                if (response.code === 0) {
                  this.$message.info("资料修改成功！");
                     this.searchForm();
                } else {
                  this.$message.error(response.message);
                }
              });
        }
        
      }
      

    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    resetSearchForm() {
      this.queryParam = {};
      this.handleOk();
    },
    selectValue(e){
      this.formVedioViewIsFee=e
      if(this.rowId!="" ){
      this.formHarassIsStart=this.queryParam.harassIsStart
      this.formWeeks=this.queryParam.week
      this.formVedioActualIsFees=this.queryParam.vedioActualIsFee
      }
      
    },
    selectAucual(e){
    this.formVedioActualIsFees=e
    if(this.rowId!="" ){
    this.formHarassIsStart=this.queryParam.harassIsStart
    this.formWeeks=this.queryParam.week
    this.formVedioViewIsFee=this.queryParam.vedioViewIsFee
    }
    },
    selectIsStart(e){
    this.formHarassIsStart=e
    if(this.rowId!="" ){
    this.formWeeks=this.queryParam.week
    this.formVedioActualIsFees=this.queryParam.vedioActualIsFee
    this.formVedioViewIsFee=this.queryParam.vedioViewIsFee
    }
    
    },
    selectWeeks(e){
    this.formWeeks=e
    if(this.rowId!="" ){
      this.formVedioActualIsFees=this.queryParam.vedioActualIsFee
    this.formVedioViewIsFee=this.queryParam.vedioViewIsFee
    this.formHarassIsStart=this.queryParam.harassIsStart
    }
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
