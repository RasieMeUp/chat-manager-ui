<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="摘要">
        <a-textarea
          :rows="4"
          v-decorator="[
            'contents',
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
        <a-input type="hidden" v-decorator="['id']" />
      </a-form-item>
      <a-form-item label="缩略图">
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
          <div v-if="fileList.length < 5">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传LOGO</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="审核状态"
      >
        <a-radio-group
          v-decorator="[
            'verify',
            {
              rules: [{ required: true, message: '请选择是否审核' }],
              initialValue: 1,
            },
          ]"
        >
          <a-radio :value="1">已审核</a-radio>
          <a-radio :value="0">未审核</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-spin>
</template>
<script>
import { ApiUrl } from "@/utils/request.js";
import { save, getById, update } from "@/api/photographs";
import pick from "lodash.pick";
import store from "@/store";
import { deleteFile } from "@/api/resource/index";
export default {
  components: {},
  data() {
    return {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      uploadUrl: ApiUrl + "/upload/uploadFile",
      fileList: [],
      headers: {
        Authorization: "bearer  " + store.getters.token,
      },
      contents: "",
      imgurls: [],
    };
  },
  created() {},
  methods: {
    add(categoryid) {
      this.modal("新建", 0);
      this.fileList = [];
    },
    edit(record) {
      this.modal("编辑", 1);
      getById({ pk: record.id }).then((response) => {
        var result = response.res;
        setTimeout(() => {
          this.form.setFieldsValue(pick(result, "id", "contents"));
          this.form.setFieldsValue({ verify: response.res.verify ? 1 : 0 });
          if (result.imgurls) {
            var imgs = result.imgurls.split("|");
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
        }, 100);
      });
    },
    modal(title, opera) {
      this.modalTitle = title;
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
          values["imgurls"] = this.imgurls.join("|") || "";
          if (this.modalOpera === 0) {
            save(values).then((response) => {
              this.$message.info(response.message);
              this.$emit("ok");
              this.handleCancel();
              this.fileList = [];
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
          // this.form.setFieldsValue({
          //   imgurls: e.file.response.res.fileFullPath
          // })
          that.imgurls = imgs;
        }, 100);
      } else {
        var imgs = [];
        if (e.fileList.length > 0) {
          e.fileList.forEach((item) => {
            imgs.push(item.url);
          });
        }
        // this.form.setFieldsValue({
        //   imgurls: e.file.response.res.fileFullPath
        // })
        that.imgurls = imgs;
      }
      console.log(e);
      console.log("_________________-1");
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
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
      window.open(file.url, "_blank");
    },
  },
};
</script>
