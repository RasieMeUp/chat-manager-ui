<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" layout="vertical">
          <a-form-item label="clientIds" v-show="false">
            <a-input v-decorator="['clientIds', { rules: [{ required: false }] }]" />
          </a-form-item>

          <a-form-item label="推送对象">
            <a-select
              :allowClear="true"
              v-decorator="[
                'typeId',
                { rules: [{ required: true, message: '请选择升级类型' }] },
              ]"
              @change="handleChange"
            >
              <a-select-option v-for="i in adverts" :key="i.value">
                {{ i.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="cid" v-show="showClientId">
            <a-input
              v-decorator="[
                'cid',
                {
                  rules: [
                    {
                      required: validCID,
                      min: 3,
                      message: '请输入至少三个字符的规则！',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="消息标题">
            <a-input
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
          </a-form-item>
          <a-form-item label="消息描述">
            <a-textarea
              :rows="4"
              v-decorator="[
                'content',
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
          <a-form-item>
            <a-button
              @click="handleSubmit"
              v-has="{ perm: 'app:push:mess:save' }"
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
import { pushMess } from "@/api/system/org";
import pick from "lodash.pick";
import { ApiUrl } from "@/utils/request.js";
import { deleteFile } from "@/api/resource/index";
import store from "@/store";
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      adverts: [
        { value: "0", name: "全部用户" },
        // { value: "1", name: "部分用户" },
        { value: "2", name: "指定用户" },
      ],
      showClientId: false,
      validCID: false,
    };
  },
  components: {},
  created() {},
  methods: {
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      let cids = this.form.getFieldValue("cid");
      if (cids) {
        this.form.setFieldsValue({
          clientIds: cids.split(","),
        });
      }
      validateFields((errors, values) => {
        if (!errors) {
          pushMess(values).then((response) => {
            this.$message.info(response.message);
          });
        }
        this.confirmLoading = false;
      });
    },
    handleChange(val) {
      this.showClientId = val != 0;
      this.validCID = val != 0;
      if (val == 0) {
        this.form.setFieldsValue({
          clientIds: "",
        });
      }
    },
  },
};
</script>
