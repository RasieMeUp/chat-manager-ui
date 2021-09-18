<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="上报内容">
        <a-textarea
          readonly
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
        <a-input type="hidden" v-decorator="['voiceurl']" />
      </a-form-item>

      <a-form-item label="上报时间">
        <span>{{time.sb |formatDate}}</span>
      </a-form-item>

      <a-form-item label="图片">
        <div>
          <img
            @click="handlePreview(item)"
            style="width: 120px; transform: scale(1) translate(0px, 0px)"
            v-for="item in imgurls"
            :src="item"
            :key="item"
          />
        </div>
      </a-form-item>
      <a-form-item label="录音">
        <div v-if="voiceurl">
          <audio :src="voiceurl" preload="auto" controls></audio>
        </div>
        <span v-else>无录音</span>
      </a-form-item>
      <a-form-item label="类型">
        <a-select
          v-decorator="[
            'categoryId',
            { rules: [{ required: false, message: '请选择类型' }] },
          ]"
          placeholder="请选择"
        >
          <a-select-option value="100">未选择</a-select-option>
          <a-select-option v-for="i in types" :key="i.value">{{ i.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="回复内容">
        <a-textarea
          :rows="4"
          readonly
          v-decorator="[
            'replyComment',
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
      <a-form-item label="回复时间">
        <span>{{time.hf |formatDate}}</span>
      </a-form-item>
    </a-form>
  </a-spin>
</template>
<script>
import moment from "moment";
import { ApiUrl } from "@/utils/request.js";
import { save, getById, update } from "@/api/photographs";
import pick from "lodash.pick";
import store from "@/store";
import { deleteFile } from "@/api/resource/index";
import { selectType } from "@/api/system/dict";
export default {
  components: {},
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
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      uploadUrl: ApiUrl + "/upload/uploadFile",
      fileList: [],
      headers: {
        Authorization: "bearer  " + store.getters.token
      },
      contents: "",
      imgurls: [],
      voiceurl: "",
      types: [],
      time: {
        sb: null,
        hf: null
      }
    };
  },
  created() {
    this.getTypes("FBXQLX");
  },
  filters: {
    formatDate(__time) {
      if (__time) {
        return moment(__time).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    }
  },
  methods: {
    add(categoryid) {},
    edit(record) {
      this.modal("编辑", 1);
      getById({ pk: record.id }).then(response => {
        var result = response.res;
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(result, "id", "contents", "replyComment", "voiceurl")
          );
          this.form.setFieldsValue({ categoryId: result.categoryId + "" });
          this.time.sb=result.gmtCreate;
          this.time.hf=result.replyDate;
          var imgs = result.imgurls.split(",");
          this.imgurls = imgs;
          this.voiceurl = result.voiceurl;
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
        form: { validateFields }
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          update(values).then(response => {
            this.$message.info(response.message);
            this.$emit("ok");
            this.handleCancel();
          });
        }
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
    },
    handlePreview(url) {
      window.open(url, "_blank");
    },
    getTypes(__type) {
      selectType({ type: __type }).then(response => {
        this.types = response.res;
      });
    }
  }
};
</script>
