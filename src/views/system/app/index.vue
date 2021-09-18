<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item
        label="业务ID"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="false"
      >
        <a-input v-decorator="['id', { rules: [{ required: true }] }]" />
      </a-form-item>
      <a-form-item
        label="升级类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          :allowClear="true"
          v-decorator="[
            'status',
            { rules: [{ required: true, message: '请选择升级类型' }] },
          ]"
        >
          <a-select-option v-for="i in adverts" :key="i.value">
            {{ i.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="appid" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'appid',
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
        label="version"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'version',
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
        label="升级文件"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <!-- <a-input type="hidden" v-decorator="['wgtUrl']" />
        <file-upload-list ref="fileUploadList" uploadBtnText="附件上传" /> -->
        <a-input
          v-decorator="[
            'wgtUrl',
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
        label="升级描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-textarea
          :rows="4"
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
        label=""
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        style="margin-left: 16.66666667%"
      >
        <a-button @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>
<script>
import moment from "moment";
import { saveApp, getApp } from "@/api/system/org";
import pick from "lodash.pick";
import { ApiUrl } from "@/utils/request.js";
import { deleteFile } from "@/api/resource/index";
import store from "@/store";
import FileUploadList from "@/components/DynamicField/FileUploadList.vue";
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      modalOpera: 0, //0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      adverts: [
        { value: "0", name: "无升级" },
        { value: "1", name: "部分升级" },
        { value: "2", name: "全包升级" },
      ],
    };
  },
  components: {
    FileUploadList,
  },
  created() {
    this.getInfo();
    
  },
  methods: {
    getInfo() {
      getApp({ pk: "502864079027699713" }).then((response) => {
        this.form.setFieldsValue(
          pick(response.res, "id", "appid", "remark", "version", "wgtUrl")
        );
        this.form.setFieldsValue({ status: response.res.status + "" });
        // this.$nextTick(() => {
        //   that.$refs.fileUploadList.setFiles(attachFiles);
        // });
      });
    },
    handleSubmit() {
      // const attachFiles = this.$refs.fileUploadList.getFiles();
      // console.log(attachFiles);
      // if (attachFiles.length > 0) {
      //   const attachs = [];
      //   attachFiles.forEach((item, index) => {
      //     console.log(item);
      //     if (item.fileFullPath) {
      //       attachs.push(item.fileFullPath);
      //     }
      //   });
      //   console.log(attachs);
      //   this.form.setFieldsValue({ wgtUrl: attachs.join("|") });
      // } else {
      //   this.$message.info("请上传升级文件");
      //   return;
      // }
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          saveApp(values).then((response) => {
            this.$message.info(response.message);
          });
        }
        this.confirmLoading = false;
      });
    },
  },
};
</script>
