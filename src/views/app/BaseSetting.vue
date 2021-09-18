<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" layout="vertical">
          <a-form-item label="业务ID" v-show="false">
            <a-input v-decorator="['id', { rules: [{ required: true }] }]" />
          </a-form-item>
          <a-form-item label="升级类型" v-show="false">
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
          <a-form-item label="appid">
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
          <a-form-item label="version">
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
          <a-form-item label="整包最低升级版本">
            <a-input
              v-decorator="[
                'minVersion',
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
          <a-form-item label="热更资源地址">
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
          <a-form-item label="安卓应用 整包地址">
            <!-- <a-input type="hidden" v-decorator="['wgtUrl']" />
        <file-upload-list ref="fileUploadList" uploadBtnText="附件上传" /> -->
            <a-input
              v-decorator="[
                'apkUrl',
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
            label="苹果应用 商店地址"
          >
            <!-- <a-input type="hidden" v-decorator="['wgtUrl']" />
        <file-upload-list ref="fileUploadList" uploadBtnText="附件上传" /> -->
            <a-input
              v-decorator="[
                'ipaUrl',
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
          <a-form-item label="升级描述">
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
          <a-form-item>
            <a-button @click="handleSubmit" v-has="{ perm: 'app:upgrade:save' }"
              >保存</a-button
            >
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
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
          pick(
            response.res,
            "id",
            "appid",
            "remark",
            "version",
            "minVersion",
            "wgtUrl",
            "ipaUrl",
            "apkUrl"
          )
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
