<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- <a-form-item label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
          <a-input v-if="modalOpera==0" v-decorator="['id']" />
          <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item> -->

        <a-form-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-model="roleName" @change="handleCurrencyChange">
                <a-select-option :value="0"> 超级管理员 </a-select-option>
                <a-select-option :value="1"> 管理员  </a-select-option>
                <a-select-option :value="2"> 客服  </a-select-option>
                <a-select-option :value="3"> 财务  </a-select-option>
                <a-select-option :value="4"> 运营  </a-select-option>
              </a-select>
        </a-form-item>

        <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['username', {rules: [{required: true, min: 3, message: '请输入账号名称！'}]}]"
          />
        </a-form-item>
        <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['password', {rules: [{required: true, min: 3, message: ' 6-16位字符'}]}]"
          />
        </a-form-item>
       
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import {creatManager,creatCustomer,creatFinance,creatOperate } from '@/api/system/cms'
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
      modalOpera: 0, // 0：新增 1：编辑
      roleName:'',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created() {},
  methods: {
    add() {
      this.modal('新增账号', 0)
    },
    edit(record) {
      this.modal('编辑账号', 1)
      // getById({ pk: record.id }).then(response => {
      //   this.form.setFieldsValue(
      //     pick(response.res, 'id', 'roleName', 'roleSign', 'remark')
      //   )
      // })
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.modalOpera === 0) {
              console.log("xinzeng==>",values,this.roleName);
              switch (this.roleName) {
                case '0':
                  this.creatManager(values);
                  break;
                case '1' : //管理员 
                    this.creatManager(values);
                  break;
                case '2' ://客服
                  this.creatCustomer(values);
                  break;
                case '3'://财务
                  this.creatFinance(values);
                  break;
                case '4' : //运营
                  this.creatOperate(values);
                  break;
              }
          } else if (this.modalOpera === 1) {
            update(values).then(response => {
              if (response.code === 0) {
                this.$message.info(response.message)
                this.$emit('searchForm')
                this.handleCancel()
              }else{
                this.$message.error(response.message)
              }
            })
          }
        }
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    },
     handleCurrencyChange(currency) {
      console.log(currency);
    },
    creatManager(values){
      creatManager(values).then(response => {
        console.log("result==>",response);
              if (response.code === 0) {
                this.$message.info(response.message)
                this.$emit('ok')
                this.handleCancel()
              }else{
                this.$message.error(response.message)
              }
      })
    },
   
  }
}
</script>
