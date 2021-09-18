<template>
  <a-modal
    :title="modalTitle"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
     @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
           <a-input v-decorator="['digitId', {rules: [{required: true}]}]"/>
        </a-form-item>
        
        <a-form-item label="动态类型" :labelCol="labelCol" :wrapperCol="wrapperCol" >

          <a-select v-decorator="['days', {rules: [{required: true,  message: '请选择动态类型！'}]}]" >
            <a-select-option :value="0" > 普通动态 </a-select-option>
            <a-select-option :value="1"  v-if="identity === 1"> 守护动态 </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer" style="text-align:center;">
       <a-button
          type="primary"
          size="default"
          @click="handleCancel()"
          style="margin:0 5px 0 0;background:#23D96E; border:1px solid #15BC58;"
          >取消
          </a-button>
          <a-button
          type="primary"
          size="default"
          @click="handleSubmit()"
          style="margin-right: 5px"
          >确定
          </a-button>
      </template>


  </a-modal>
</template>

<script>
import moment from 'moment'
import {put } from "@/api/system/forbiddenManager";
import { guardChange} from "@/api/system/dynamic";
import pick from 'lodash.pick'
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      modalTitle: '',
      visible: false,
      confirmLoading: false,
      identity:'',
      form: this.$form.createForm(this)
    }
  },
  created() {},
  methods: {
    add(digitId,identity) {
      this.modal('动态修改');
      this.$nextTick(()=>{
        var vobj ={
          digitId: digitId,
        }
        this.identity=identity
        this.form.setFieldsValue(vobj);
      });

     
    },
    modal(title) {
      this.modalTitle = title
      this.visible = true
      this.form.resetFields()
    },
    handleSubmit() {
      const that = this;
      this.confirmLoading = true
      that.form.validateFields((errors, values) => {
        if (!errors) {
        guardChange({
          dynamicId: values.digitId,
          isGuard: values.days,
        }) 
      .then((response) => {
          console.log("动态切换==>", response);
          if (response.success){ 
            this.$message.info("操作成功!");  
            this.handleCancel()
            }
          else {
            this.$message.error(response.message);
            }
        })
        .then(() => {
          this.shModal = false;
        });

          }
          that.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
