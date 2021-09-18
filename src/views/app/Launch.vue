<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" layout="vertical">
          <a-form-item label="业务ID" v-show="false">
            <a-input v-decorator="['id']" />
            <a-input v-decorator="['appid']" />
            <a-input v-decorator="['remark']" />
            <a-input v-decorator="['version']" />
            <a-input v-decorator="['minVersion']" />
            <a-input v-decorator="['wgtUrl']" />
            <a-input v-decorator="['ipaUrl']" />
            <a-input v-decorator="['apkUrl']" />
          </a-form-item>
          <a-form-item label="启动页广告">
            <a-switch
              v-decorator="['advertiseStatus', { valuePropName: 'checked' }]"
              checked-children="开启"
              un-checked-children="关闭"
            />
          </a-form-item>
          <a-form-item label="广告图">
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
                <div class="ant-upload-text">上传广告图</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item>
            <a-button @click="handleSubmit" v-has="{ perm: 'app:link:save' }"
              >保存</a-button
            >
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { ApiUrl } from "@/utils/request.js";
import moment from "moment";
import { saveApp, getApp } from "@/api/system/org";
import pick from "lodash.pick";
import store from "@/store";
import { deleteFile } from "@/api/resource/index";
export default {
  data() {
    return {
      modalOpera: 0, //0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      uploadUrl: ApiUrl + "/upload/uploadFile",
      fileList: [],
      headers: {
        Authorization: "bearer  " + store.getters.token,
      },
      imgurls: [],
    };
  },
  components: {},
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getApp({ pk: "502864079027699713" }).then((response) => {
        var result = response.res;
        this.form.setFieldsValue(
          pick(
            response.res,
            "id",
            "advertiseStatus",
            "appid",
            "remark",
            "version",
            "minVersion",
            "wgtUrl",
            "ipaUrl",
            "apkUrl"
          )
        );
        if (result.advertiseImgUrl) {
          var imgs = result.advertiseImgUrl.split("|");
          var temps = [];
          var temp2 = [];
          if (imgs.length > 0) {
            imgs.forEach((res, indexid) => {
              temps.push({
                uid: result.id + "_" + indexid,
                name: "imgurls",
                status: "done",
                url: res,
              });
              temp2.push(res);
            });
          }
          this.fileList = temps;
          this.imgurls = temp2;
        }
      });
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          values["advertiseImgUrl"] = this.imgurls.join("|") || "";
          saveApp(values).then((response) => {
            this.$message.info(response.message);
          });
        }
        this.confirmLoading = false;
      });
    },
    handleFileChange(e) {
      const that = this;
      this.fileList = e.fileList;
      if (e.file.response && e.file.response.code === 0) {
        this.disable = true;
        setTimeout(() => {
          var imgs = [];
          if (e.fileList.length > 0) {
            e.fileList.forEach((item) => {
              imgs.push(item.response.res.fileFullPath);
            });
          }
          that.imgurls = imgs;
        }, 100);
      } else {
        var imgs = [];
        if (e.fileList.length > 0) {
          e.fileList.forEach((item) => {
            imgs.push(item.url);
          });
        }
        that.imgurls = imgs;
      }
      console.log(e);
      console.log("_________________-1");
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
      window.open(file.url, "_blank");
    },
    removeFile(file) {
      this.disable = false;
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
  },
};
</script>
