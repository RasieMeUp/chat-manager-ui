<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="标题">
        <a-input
          placeholder="请输入标题"
          v-decorator="[
            'title',
            {
              rules: [
                {
                  required: true,
                  min: 2,
                  message: '请输入至少2个字符的规则！',
                },
              ],
            },
          ]"
        />
        <a-input type="hidden" v-decorator="['id']" />
      </a-form-item>
      <a-form-item label="类型">
        <a-select
          :allowClear="true"
          v-decorator="[
            'typeId',
            { rules: [{ required: true, message: '请选择类型' }] },
          ]"
          placeholder="请选择"
          @change="handleSelectChange"
        >
          <a-select-option value="0">文档上传</a-select-option>
          <a-select-option value="1">本地文章</a-select-option>
          <a-select-option value="2">外部链接</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="子分类">
        <a-select
          placeholder="请选择子分类"
          :allowClear="true"
          v-decorator="[
            'itemtypeId',
            { rules: [{ required: true, message: '请选择子分类' }] },
          ]"
        >
          <a-select-option v-for="i in itemTypes" :key="i.value">
            {{ i.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注信息">
        <a-textarea
          :rows="4"
          v-decorator="[
            'remarks',
            {
              rules: [
                {
                  required: false,
                  min: 3,
                  message: '请输入至少三个字符的规则！',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="外部链接" v-if="temptypeid == 2">
        <a-input
          placeholder="请输入外部链接"
          v-decorator="[
            'contents',
            { rules: [{ required: false, min: 2, message: '请输入外部链接' }] },
          ]"
        />
      </a-form-item>
      <a-form-item label="文件" v-if="temptypeid == 0">
        <a-input type="hidden" v-decorator="['contents']" />
        <a-upload
          name="file"
          :action="uploadUrl"
          :headers="headers"
          listType="picture-card"
          :fileList="fileList"
          :remove="removeFile"
          @preview="handlePreview"
          @change="handleFileChange"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传文件</div>
          </div>
        </a-upload>
      </a-form-item>
      <div style="width: 106%; margin-left: -27px"  v-if="temptypeid == 1">
        <editor ref="tinymce1" :ctlId="editorId"></editor>
      </div>
    </a-form>
  </a-spin>
</template>
<script>
import { ApiUrl } from '@/utils/request.js'
import { save, getById, update } from '@/api/word'
import pick from 'lodash.pick'
import store from '@/store'
import { deleteFile } from '@/api/resource/index'
import { selectType } from '@/api/system/dict'
import Editor from '@/components/Tinymce/Tinymce.vue'
export default {
  components: {
    Editor
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
      contents: '',
      imgurls: [],
      temptypeid: 0,
      itemTypes: [],
      editorId: new Date().getTime()+"-editor",
    }
  },
  created() {},
  mounted() {
    this.getTypes('CMWDLX')
  },
  methods: {
    add(categoryid) {
      this.modal('新建', 0)
      this.fileList = []
      //this.form.setFieldsValue({ typeId: '0' })
    },
    edit(record) {
      const that = this
      that.modal('编辑', 1)
      getById({ pk: record.id }).then((response) => {
        var result = response.res
        that.temptypeid = result.typeId
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(result, 'id', 'title', 'remarks')
          )
          this.form.setFieldsValue({ typeId: result.typeId+'' })
          this.form.setFieldsValue({ itemtypeId: result.itemtypeId+'' })
          const conts = result.contents
          if (conts) {
            switch (result.typeId) {
              case 0:
                that.fileList = [
                  {
                    uid: result.id,
                    name: '文档',
                    status: 'done',
                    url: result.conts
                  }
                ]
                break
              case 1:
                that.$nextTick(() => {
                  that.$refs.tinymce1.setContent(conts || '')
                })
                break
              case 2:
                that.form.setFieldsValue({ contents: conts })
                break
            }
          }
        }, 100)
      })
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
      this.temptypeid=0
      this.$nextTick(() => {
        this.$refs.tinymce1.setContent('')
      })
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (values['typeId'] === '1') {
            const editorContent = this.$refs.tinymce1.getContent()
            values['contents'] = editorContent
          }

          if (this.modalOpera === 0) {
            save(values).then((response) => {
              this.$message.info(response.message)
              this.$emit('ok')
              this.handleCancel()
              this.fileList = []
            })
          } else if (this.modalOpera === 1) {
            update(values).then((response) => {
              this.$message.info(response.message)
              this.$emit('ok')
              this.handleCancel()
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
    handleFileChange(e) {
      this.fileList = e.fileList
      if (e.file.response && e.file.response.code === 0) {
        this.disable = true

        setTimeout(() => {
          this.form.setFieldsValue({
            contents: e.file.response.res.fileFullPath
          })
        }, 100)
      }
    },
    removeFile(file) {
      this.disable = false
      if (file && !file.error && file.response) {
        deleteFile({
          filePath: file.response.res.path
        }).then((response) => {
          if (response.code === 0) {
            console.log('delete file success')
          }
        })
      }
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
      window.open(file.url, '_blank')
    },
    handleSelectChange(value) {
      this.temptypeid = value
    },
    getTypes(__type) {
      selectType({ type: __type }).then((response) => {
        this.itemTypes = response.res
      })
    }
  }
}
</script>
