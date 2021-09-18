<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
              <a-form-item label="评论内容">
            <a-textarea
              :rows="4"
              v-decorator="['comment', {rules: [{required: false, min: 3, message: '请输入至少三个字符的规则！'}]}]"
            />
          <a-input type="hidden"   v-decorator="['id']" />
          </a-form-item>
           <a-form-item label="评论回复内容" >
            <a-textarea
              :rows="4"
              v-decorator="['reply', {rules: [{required: false, min: 3, message: '请输入至少三个字符的规则！'}]}]"
            />
          </a-form-item>
    </a-form>
  </a-spin>
</template>
<script>
import { ApiUrl } from '@/utils/request.js'
import { update, getById } from '@/api/usercomment'
import pick from 'lodash.pick'
import store from '@/store'
import { deleteFile } from '@/api/resource/index'
export default {
  components: {
    
  },
  data() {
    return {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      uploadUrl: ApiUrl + '/upload/uploadFile',
      fileList: [],
      headers: {
        Authorization: 'bearer  ' + store.getters.token
      },
      contents: ''
    }
  },
  created() {},
  methods: {
    add(categoryid) {
    },
    edit(record) {
      console.log(record)
      this.modal('回复', 1)
      this.form.setFieldsValue({ id: record.id })
      getById({ pk: record.id }).then((response) => {
        var result= response.res
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(
              result,
              'id',
              'comment',
              'reply'
            )
          )
        }, 100)
      })
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
          update(values).then((response) => {
            this.$message.info(response.message)
            this.$emit('ok')
            this.handleCancel()
          })
        }
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
