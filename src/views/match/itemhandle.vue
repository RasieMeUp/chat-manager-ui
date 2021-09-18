<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="名称">
        <a-input
          placeholder="请输入名称"
          v-decorator="[
            'name',
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
        <a-input type="hidden" v-decorator="['id']" />
        <a-input type="hidden" v-decorator="['matchid']" />
      </a-form-item>
      <a-form-item label="地址">
        <a-input
          placeholder="请输入地址"
          v-decorator="[
            'address',
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
      <a-form-item label="排序">
        <a-input-number
          placeholder="排序，数字大在前"
          v-decorator="[
            'sort',
            { rules: [{ required: true, message: '请输入数字' }] },
          ]"
        />
      </a-form-item>
      <a-form-item label="展示图片">
        <a-input type="hidden" v-decorator="['imgurl']" />
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
            <div class="ant-upload-text">上传图片</div>
          </div>
        </a-upload>
      </a-form-item>
      <div style="width: 106%; margin-left: -27px">
        <editor ref="tinymce1" :ctlId="editorId"></editor>
      </div>
    </a-form>
  </a-spin>
</template>
<script>
import { ApiUrl } from "@/utils/request.js";
import { save, getById, update } from "@/api/matchitem";
import pick from "lodash.pick";
import store from "@/store";
import { deleteFile } from "@/api/resource/index";
import Editor from "@/components/Tinymce/Tinymce.vue";
export default {
  components: {
    Editor,
  },
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
      videoList: [],
      headers: {
        Authorization: "bearer  " + store.getters.token,
      },
      editorId: new Date().getTime() + "-editor",
    };
  },
  created() {},
  methods: {
    add(matchid) {
      this.modal("新建评选", 0);
      this.form.setFieldsValue({
        matchid: matchid,
      });
    },
    edit(record) {
      this.modal("编辑评选", 1);
      getById({ pk: record.id }).then((response) => {
        var result = response.res;
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(result, "id", "name", "sort", "address")
          );
          if (result.imgurl) {
            this.fileList = [
              {
                uid: result.id,
                name: "imgurl",
                status: "done",
                url: result.imgurl,
              },
            ];
          }
          this.$refs.tinymce1.setContent(result.contents || "");
        }, 100);
      });
    },
    modal(title, opera) {
      this.modalTitle = title;
      this.modalOpera = opera;
      this.visible = true;
      this.form.resetFields();
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs.tinymce1.setContent("");
      });
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      const that = this;
      validateFields((errors, values) => {
        if (!errors) {
          const editorContent = this.$refs.tinymce1.getContent();
          values["contents"] = editorContent;
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
      this.fileList = e.fileList;
      if (e.file.response && e.file.response.code === 0) {
        this.disable = true;

        setTimeout(() => {
          this.form.setFieldsValue({
            imgurl: e.file.response.res.fileFullPath,
          });
        }, 100);
      }
      console.log(this.fileList);
      console.log("----------------");
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
  watch: {},
};
</script>
