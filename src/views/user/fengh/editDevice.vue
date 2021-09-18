<template>
  <a-modal
    :title="modalTitle"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="设备ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
           <a-input v-decorator="['deviceId', {rules: [{required: true}]}]"/>
        </a-form-item>
          <a-form-item label="type" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
           <a-input v-decorator="['type', {rules: [{required: true}]}]"/>
        </a-form-item>
        <a-form-item label="封号天数" :labelCol="labelCol" :wrapperCol="wrapperCol">

          <a-select v-decorator="['days', {rules: [{required: true,  message: '请选择封号天数！'}]}]" >
            <a-select-option :value="1"> 1天 </a-select-option>
            <a-select-option :value="7"> 7天 </a-select-option>
            <a-select-option :value="0"> 永久 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="textarea" 
            v-decorator="['message', {rules: [{required: true,min: 1, message: '请填写备注信息！'}]}]"
          />

        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import {deviceForbiden } from "@/api/system/forbiddenManager";
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
      form: this.$form.createForm(this)
    }
  },
  created() {},
  methods: {
    add(userDevice,type) {
      this.modal('封号');
      this.$nextTick(()=>{
        var vobj ={
          deviceId: userDevice.id,
          type:type,
        }
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
          console.log(values)
          if (!errors) {
              deviceForbiden(values).then(response => {
                if (response.code === 0) {
                   that.$message.info(response.message)
                  that.$message.info('操作成功')
                  that.$emit('searchForm');
                  that.handleCancel()
                }else{
                  that.$message.error(response.message)
                }
              })
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
