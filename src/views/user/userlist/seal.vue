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
        <a-form-item label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
           <a-input v-decorator="['digitId', {rules: [{required: true}]}]"/>
        </a-form-item>
        <a-form-item label="是否封号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
           <a-input v-decorator="['recommend', {rules: [{required: true}]}]"/>
        </a-form-item>
        <a-form-item label="封号天数" :labelCol="labelCol" :wrapperCol="wrapperCol">

          <a-select v-decorator="['type', {rules: [{required: true,  message: '请选择封号天数！'}]}]" >
            <a-select-option :value="0"> 1天 </a-select-option>
            <a-select-option :value="1"> 7天 </a-select-option>
            <a-select-option :value="2"> 永久 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="textarea" 
            v-decorator="['remark', {rules: [{required: true,min: 1, message: '请填写备注信息！'}]}]"
          />

        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { anchorRecommendHandle } from '@/api/system/userManager'
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
    add(digitId) {
      this.modal('封号');
      this.$nextTick(()=>{
        var vobj ={
          digitId: digitId,
          recommend:1
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
      that.$message.error('接口ing');

      // this.confirmLoading = true
      // that.form.validateFields((errors, values) => {
      //     if (!errors) {
      //         anchorRecommendHandle(values).then(response => {
      //           if (response.code === 0) {
      //             this.$message.info(response.message)
      //             this.$emit('ok')
      //             this.handleCancel()
      //           }else{
      //             this.$message.error(response.message)
      //           }
      //         })
      //     }
      //     that.confirmLoading = false
      // })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
