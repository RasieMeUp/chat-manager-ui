<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item
        label="业务ID"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="false"
      >
        <a-input
          v-if="modalOpera == 1"
          v-decorator="['id', { rules: [{ required: true }] }]"
        />
      </a-form-item>
      
      <a-form-item
        label="处理人姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'name',
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
      </a-form-item>
      <a-form-item
        label="职位"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'position',
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
      <a-form-item
        label="头像"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input type="hidden" v-decorator="['headPic']" />
        <a-upload
          name="file"
          :action="upload.action"
          :headers="upload.headers"
          listType="picture-card"
          :fileList="upload.fileList"
          :remove="removeFile"
          @preview="handlePreview"
          @change="handleFileChange"
        >
          <div v-if="upload.fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传头像</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="显示顺序"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          style="width: 100%"
          :min="0"
          :max="1000"
          v-decorator="[
            'orderNum',
            {
              rules: [{ required: true, message: '请输入顺序' }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'remark',
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
      <a-form-item
        label="是否可用"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          v-decorator="[
            'status',
            {
              rules: [{ required: true, message: '请选择是否可用' }],
              initialValue: 1,
            },
          ]"
        >
          <a-radio :value="1">是</a-radio>
          <a-radio :value="0">否</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
import moment from "moment";
import pick from "lodash.pick";
import { ApiUrl } from "@/utils/request.js";
import { deleteFile } from "@/api/resource/index";
import { save, getByPk, update } from "@/api/system/handle";
import store from "@/store";
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      modalOpera: 0, //0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      upload: {
        fileList: [],
        action: ApiUrl + "/upload/uploadFile",
        headers: {
          Authorization: "bearer  " + store.getters.token,
        },
      },
      adverts: [],
    };
  },
  created() {
  },
  methods: {
    add() {
      this.modal(0);
    },
    edit(record) {
      this.modal(1);
      getByPk({ pk: record.id }).then((response) => {
        this.form.setFieldsValue(
          pick(
            response.res,
            "id",
            "position",
            "name",
            "remark",
            "headPic",
            "orderNum"
          )
        );
        this.form.setFieldsValue({ status: response.res.status ? 1 : 0 });
        if (response.res.headPic) {
          this.upload.fileList = [
            {
              uid: response.res.id,
              name: "headPic",
              status: "done",
              url: response.res.headPic,
            },
          ];
        }
      });
    },
    modal(opera) {
      this.upload.fileList = [];
      this.modalOpera = opera;
      this.visible = true;
      this.form.resetFields();
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          if (this.modalOpera === 0) {
            save(values).then((response) => {
              this.$message.info(response.message);
              this.$emit("ok");
              this.handleCancel();
            });
          } else if (this.modalOpera === 1) {
            update(values).then((response) => {
              this.$message.info(response.message);
              this.$emit("ok");
              this.handleCancel();
            });
          }
        }
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
    },
    handleFileChange(e) {
      this.upload.fileList = e.fileList;
      if (e.file.response && e.file.response.code === 0) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            headPic: e.file.response.res.fileFullPath,
          });
        });
      }
    },
    removeFile(file) {
      if (file && !file.error && file.response) {
        deleteFile({
          filePath: file.response.res.path,
        }).then((response) => {
          if (response.code === 0) {
            console.log("delete file success");
          }
        });
      }
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
      window.open(file.url, "_blank");
    },
  },
};
</script>
