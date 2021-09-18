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
                  min: 3,
                  message: '请输入至少三个字符的规则！',
                },
              ],
            },
          ]"
        />
        <a-input type="hidden" v-decorator="['id']" />
      </a-form-item>
      <a-form-item label="是否单选">
        <a-radio-group
          v-decorator="[
            'single',
            {
              rules: [{ required: true, message: '请选择是否单选' }],
              initialValue: 1,
            },
          ]"
          @change="singleChangeEvent"
        >
          <a-radio :value="0">否</a-radio>
          <a-radio :value="1">是</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="最多可选">
        <a-input
          :min="1"
          :max="9"
          style="width: 100%"
          :disabled="disableMaxSelect"
          v-decorator="[
            'maxSelect',
            {
              rules: [{ required: true, message: '请输入最多可选' }],
              initialValue: 1,
            },
          ]"
        />
      </a-form-item>

      <a-form-item label="开始时间">
        <a-date-picker
          style="width: 100%"
          v-decorator="[
            'starttime',
            { rules: [{ required: true, message: '请选择开始时间' }] },
          ]"
        />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker
          style="width: 100%"
          v-decorator="[
            'endtime',
            { rules: [{ required: true, message: '请选择结束时间' }] },
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
    </a-form>
  </a-spin>
</template>
<script>
import { ApiUrl } from "@/utils/request.js";
import { save, getById, update } from "@/api/match";
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
      videoList: [],
      headers: {
        Authorization: "bearer  " + store.getters.token,
      },
      disableMaxSelect: true,
    };
  },
  created() {},
  methods: {
    add(typeid) {
      this.modal("新建评选", 0);
    },
    edit(record) {
      this.modal("编辑评选", 1);
      getById({ pk: record.id }).then((response) => {
        var result = response.res;
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(result, "id", "starttime", "title", "endtime", "maxSelect")
          );
          this.form.setFieldsValue({
            single: response.res.single ? 1 : 0,
          });
          this.disableMaxSelect = response.res.single;
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
        }, 100);
      });
    },
    modal(title, opera) {
      this.modalTitle = title;
      this.modalOpera = opera;
      this.visible = true;
      this.form.resetFields();
      this.fileList = [];
      this.disableMaxSelect=true;
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      const that = this;
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
    singleChangeEvent(e) {
      this.disableMaxSelect = e.target.value === 1 ? true : false;
    },
  },
  watch: {},
};
</script>
