<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form"  >
        <a-row :gutter="24">
          <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
            <a-form-item
              label="视频收费范围"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="paramterData.videoPrice"  
                v-decorator="[
                  'videoPrice',
                  {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        message: '请输入至少1个字符的规则！',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>     
          </a-col>
          <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
             <a-form-item
              label="视频分成范围"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="paramterData.videoPriceScope" 
                v-decorator="[
                  'videoPriceScope',
                  {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        message: '请输入至少1个字符的规则！',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          
        </a-row>
        <a-row :gutter="24">
          <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
            <a-form-item
              label="语音收费范围"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="paramterData.vociePrice"
                v-decorator="[
                  'voicePrice',
                  {
                    rules: [
                      {
                        required: true,
                        min: 3,
                        message: '请输入至少三个字符的规则！',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
            <a-form-item
              label="语音分成范围"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="paramterData.voicePriceScope"
                v-decorator="[
                  'voicePriceScope',
                  {
                    rules: [
                      {
                        required: true,
                        min: 3,
                        message: '请输入至少三个字符的规则！',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        
        </a-row>
        <a-row :gutter="24">
          <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
            <a-form-item
              label="聊天收费范围"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="paramterData.msgPrice"
                v-decorator="[
                  'msgPrice',
                  {
                    rules: [
                      {
                        required: true,
                        min: 3,
                        message: '请输入至少三个字符的规则！',
                      },
                    ],
                  },
                ]"
              />
              
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
            <a-form-item
              label="聊天分成范围"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="paramterData.msgPriceScope"
                v-decorator="[
                  'msgPriceScope',
                  {
                    rules: [
                      {
                        required: true,
                        min: 3,
                        message: '请输入至少三个字符的规则！',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

<a-row :gutter="24">
          <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
        
          </a-col>
          <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
            <a-form-item
              label="礼物分成范围"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="paramterData.giftPriceScope"
                v-decorator="[
                  'giftPriceScope',
                  {
                    rules: [
                      {
                        required: true,
                        min: 3,
                        message: '请输入至少三个字符的规则！',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
         <a-form-item >
            <a-button @click="submitInfo" class="mask">保存</a-button>
          </a-form-item>
      </a-form>
       </a-spin>
</template>

<script>
import { getPriceConfig,createPriceConfig } from "@/api/system/management/paramter";
import pick from "lodash.pick";
export default {
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
      paramterData:{
           msgPrice:"",
          videoPrice:"",
          voicePrice:"",
          videoPriceScope:"",
          voicePriceScope:"",
          msgPriceScope:"",
          giftPriceScope:"",
      },
     
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
    };
  },
  created() {},

  mounted() {
    document.body.classList.add("userLayout");
 //this.add();
 //console.log(this.add());

  getPriceConfig().then((response) => {
         // this.paramterData = response.data;
  if(response.success){
   this.form.resetFields();
      var vobj ={
        msgPrice:response.data.msgPrice,
        videoPrice: response.data.videoPrice,
        voicePrice: response.data.voicePrice,
        videoPriceScope:response.data.videoPriceScope,
        voicePriceScope:response.data.voicePriceScope,
        msgPriceScope:response.data.msgPriceScope,
        giftPriceScope:response.data.giftPriceScope,
      }    
       this.form.setFieldsValue(vobj);   
         }
        });    
  },

   
  methods: {
    submitInfo() {
      const {
        form: { validateFields },
      } = this;
      //this.confirmLoading = true;
      validateFields((errors, values) => {
  this.$confirm({
        title: "操作提醒",
        content: "收费范围喝分成比例将影响线上计费,确定要修改吗?",
        onOk() {
         if (!errors) {
          createPriceConfig(
              {msgPrice: values.msgPrice,
              videoPrice: values.videoPrice,
              voicePrice: values.voicePrice,
              videoPriceScope: values.videoPriceScope,
              voicePriceScope: values.voicePriceScope,
              msgPriceScope: values.msgPriceScope,
              giftPriceScope: values.giftPriceScope,
             }).then((response) => {
               //this.confirmLoading = false;
                     this.form.resetFields();
           var vobj ={
             msgPrice:response.data.msgPrice,
             videoPrice: response.data.videoPrice,
             voicePrice: response.data.voicePrice,
             videoPriceScope:response.data.videoPriceScope,
             voicePriceScope:response.data.voicePriceScope,
             msgPriceScope:response.data.msgPriceScope,
             giftPriceScope:response.data.giftPriceScope,
           }    
           this.form.setFieldsValue(vobj); 
          
            this.$message.info("操作成功!");
            });
        }
      //  this.confirmLoading = false;
        },
        onCancel() {},
      });
 


      });
    },
   
  },
};
</script>
<style lang="less" scoped>
 .mask {
  background-color :#336699;
  margin: 0 750px;
  width: 100px;
}
</style>
