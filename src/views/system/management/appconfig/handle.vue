<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
       <a-row :gutter="24"> 
         <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
                     <a-form-item
              label="版本描述"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            > {{ profileData.remark}}
                     </a-form-item>     
                </a-col>

                <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
                     <a-form-item
              label="版本号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            > {{ profileData.version}}
                     </a-form-item>     
                </a-col>
              </a-row>
            
              <a-row :gutter="24">
                <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
                  <a-form-item label="生效星期"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
                         <a-select v-decorator="['week', {rules: [{required: true,  message: '请选择'}]}]" mode="multiple" >
                         <a-select-option v-for="(role, index) in weekList" :key="index" :value="role.value" >{{ role.name }}</a-select-option>
                      </a-select>
                    </a-form-item>
                </a-col>

                <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
                  <!-- {{ profileData.city }} -->
                  <a-form-item label="生效时段"
                    :labelCol="labelCol"
                :wrapperCol="wrapperCol">
                    <a-input style="width:70px"
                      v-decorator="['startTiem', {rules: [{message: '请输入'}]}]"
                    />
                  至
                    <a-input style="width:70px"
                      v-decorator="['endTime', {rules: [{message: '请输入'}]}]"
                    />
                    </a-form-item>
                </a-col>
              </a-row>
         
              <a-row  :gutter="24">
                <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
                   <a-form-item label="是否审核动态"
                    :labelCol="labelCol"
                :wrapperCol="wrapperCol">
                      <a-select v-decorator="['versionStatus', {rules: [{required: true,  message: '请选择'}]}]" >
                        <a-select-option :value="0"> 否 </a-select-option>
                        <a-select-option :value="1"> 是 </a-select-option>
                      </a-select>
                    </a-form-item>
                </a-col>

                 <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
                   <a-form-item label="是否骚扰"
                    :labelCol="labelCol"
                :wrapperCol="wrapperCol">
                      <a-select v-decorator="['harassIsStart', {rules: [{required: true,  message: '请选择'}]}]"  >       
                        <a-select-option :value="0"> 否 </a-select-option>
                        <a-select-option :value="1"> 是 </a-select-option>
                      </a-select>
                    </a-form-item>
                </a-col>
              </a-row>

              <a-row  :gutter="24">
                <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
                <a-form-item label="是否收费："   
                :labelCol="labelCol"
                :wrapperCol="wrapperCol">
                      <a-select v-decorator="['vedioActualIsFee', {rules: [{required: true,  message: '请选择'}]}]"  >
                        <a-select-option :value="0"> 否 </a-select-option>
                        <a-select-option :value="1"> 是 </a-select-option>
                      </a-select>
                    </a-form-item>
                </a-col>

                <a-col  :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
                <a-form-item label="是否展示收费："
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol">
                      <a-select v-decorator="['vedioViewIsFee', {rules: [{required: true,  message: '请选择'}]}]" >
                        <a-select-option :value="0"> 否 </a-select-option>
                        <a-select-option :value="1"> 是 </a-select-option>
                      </a-select>
                    </a-form-item>
                </a-col>
              </a-row>
    </a-form>

  

  
  </a-spin>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import { STable } from "@/components";
import { updateAppConfig } from "@/api/system/management/paramter";

export default {
  name: "configDetail",
  components: {
    STable,
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
       labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
     isChecked: false,
      confirmLoading: false,
     
      handleOk: false,
      // 查询参数
      queryParam: {
        versionStatus:"",
        vedioActualIsFee:"",
        vedioViewIsFee:"",
        harassIsStart:"",
      },
      // 传值参数
      pageParam: {},
      // 个人信息结果数据
      profileData: {},   
      desc: "",
    weekList:[
      {name:"周一", value:"2"},
      {name:"周二", value:"3"},
      {name:"周三", value:"4"},
      {name:"周四", value:"5"},
      {name:"周五", value:"6"},
      {name:"周六", value:"7"},
      {name:"周日", value:"1"},
    
    ],

      form: this.$form.createForm(this),
      confirmLoading: false,
    };
  },
  created() {
    this.confirmLoading = true;
  },
  filters: {
    statusType(__value, __status) {
      return __status[__value];
    },
    isEmpty(__value, __type) {
      if (__value !== null && typeof __value !== "undefined") return __value;
      if (__type) {
        return "-";
      } else {
        return "0";
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
    edit(record) {
      this.pageParam = record;
      this.$nextTick(() => {
        this.loadData(record);
   
      });
    },
  
   setFormData() {
      this.form.resetFields();
      var vobj = {
        week: this.profileData.week,
        startTiem:this.profileData.startTime,
        endTime:this.profileData.endTime,
      };
      this.form.setFieldsValue(vobj);
    },
   
    handleCancel(e) {
      this.imgModal = false;
      this.videoModal = false;
    },
    //个人信息
    loadData(record) {
      this.profileData =record;
      this.setFormData();
      this.confirmLoading = false;


       if(this.profileData.versionStatus==1){
         this.queryParam.versionStatus= "是";
      }else{
         this.queryParam.versionStatus= "否";
      }

      if(this.profileData.vedioActualIsFee==1){
         this.queryParam.vedioActualIsFee= "是";
      }else{
         this.queryParam.vedioActualIsFee= "否";
      }

       if(this.profileData.vedioViewIsFee==1){
         this.queryParam.vedioViewIsFee= "是";
      }else{
         this.queryParam.vedioViewIsFee= "否";
      }

      // if(this.profileData.harassIsStart==1){
      //    this.queryParam.harassIsStart= "是";
      // }else{
      //    this.queryParam.harassIsStart= "否";
      // }

       console.log(this.queryParam)
    },
 

   
    handleEdit() {
      const that = this;
      this.$confirm({
        title: "修改确认",
        content: h => (
          <div style="color:#000; font-size:15px;">确定要修改吗？</div>
        ),
        onOk() {
          that.confirmLoading = true;
          that.form.validateFields((errors, values) => {
            if (!errors) {
              updateAppConfig(
                {version: values.version,
              week: values.week,
              startTime: values.startTime,
              endTime: values.endTime,
              versionStatus: values.versionStatus,
              vedioActualIsFee: values.vedioActualIsFee,
              vedioViewIsFee: values.vedioViewIsFee,
               harassIsStart: values.harassIsStart,
             }).then(response => {
               // console.log("编辑接口 updateUserProfileBase: ", response);
                if (response.code === 0) {
                  that.$message.info("资料修改成功！");
                  // that.$emit("ok");

                     this.loadData(response.data);



                  // that.handleCancel();
                } else {
                  that.$message.error(response.message);
                }
              });
            }
            that.confirmLoading = false;
          });
        },
        onCancel() {}
      });
    },
  
  
  }
};
</script>
