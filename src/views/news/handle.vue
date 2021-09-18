<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-row :gutter="64">
        <a-col :span="12">
          <a-form-item label="标题">
            <a-input
              placeholder="请输入标题"
              v-decorator="[
                'title',
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
            <a-input type="hidden" v-decorator="['categoryid']" />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item label="排序">
            <a-input-number
              placeholder="排序，数字大在前"
              v-decorator="[
                'sort',
                {
                  rules: [{ required: false, message: '请输入数字' }],
                  initialValue: 0,
                },
              ]"
            />
          </a-form-item>
        </a-col> -->
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <a-form-item label="关键字">
            <a-input
              placeholder="多个关键字，用空格分隔"
              v-decorator="[
                'keyword',
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
        </a-col>
      </a-row>
      <a-row :gutter="64">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item label="点击数">
            <a-input-number
              placeholder="请输入点击数"
              v-decorator="[
                'clicknum',
                {
                  rules: [{ required: true, message: '请输入数字' }],
                  initialValue: 0,
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item label="是否允许评论">
            <a-radio-group
              v-decorator="[
                'iscomment',
                {
                  rules: [{ required: true, message: '请选择是否允许评论' }],
                  initialValue: 0,
                },
              ]"
            >
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <a-form-item label="缩略图">
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
                <div class="ant-upload-text">上传LOGO</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <a-col :xl="{ span: 24 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <a-form-item label="摘要">
            <a-textarea
              :rows="3"
              v-decorator="[
                'description',
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
        </a-col>
      </a-row>
      <div style="width: 106%; margin-left: -27px">
        <editor ref="tinymcenew" :ctlId="editorId"></editor>
      </div>
    </a-form>
  </a-spin>
</template>
<script>
import { ApiUrl } from "@/utils/request.js";
import { save, getById, update, selectRoles } from "@/api/news";
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
      headers: {
        Authorization: "bearer  " + store.getters.token,
      },
      contents: "",
      editorId: new Date().getTime() + "-editor",
    };
  },
  created() {},
  methods: {
    add(categoryid) {
      this.modal("新建文章", 0);
      this.fileList = [];
      this.form.setFieldsValue({ categoryid: categoryid });
    },
    edit(record) {
      this.modal("编辑文章", 1);
      getById({ id: record.id }).then((response) => {
        var result = response.res;
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(
              result,
              "id",
              "categoryid",
              "title",
              "keyword",
              "clicknum",
              // "sort",
              "description"
            )
          );
          this.form.setFieldsValue({
            iscomment: result.iscomment === true ? 1 : 0,
          });
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
          this.$refs.tinymcenew.setContent(result.contents || "");
        }, 100);
      });
    },
    modal(title, opera) {
      this.modalTitle = title;
      this.modalOpera = opera;
      this.visible = true;
      this.form.resetFields();
      this.$nextTick(() => {
        this.$refs.tinymcenew.setContent("");
      });
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          const editorContent = this.$refs.tinymcenew.getContent();
          values["contents"] = editorContent;
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
      this.$refs.tinymcenew.setContent("");
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
};
</script>
