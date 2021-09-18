<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item
        label="业务ID"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="false"
      >
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item label="职称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'position',
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
        label="支部书记"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          v-decorator="[
            'secretary',
            {
              rules: [{ required: true, message: '请选择是否支部书记' }],
              initialValue: 0,
            },
          ]"
        >
          <a-radio :value="0">否</a-radio>
          <a-radio :value="1">是</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <div style="float: right;">
      <a-button type="default" @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleSubmit" style="margin-left:10px;">保存</a-button>
    </div>
  </a-spin>
</template>

<script>
import moment from "moment";
import { getUserById, updateUser } from "@/api/system/party";
import pick from "lodash.pick";
export default {
  name: "form-handle",
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
    };
  },
  created() {},
  methods: {
    edit(record, foreignId) {
      // console.log(record, foreignId);
      if (record && foreignId) {
        this.form.resetFields();
        getUserById({ userId: record.id, branchId: foreignId }).then(
          (response) => {
            this.form.setFieldsValue(pick(response.res, "id", "position"));
            this.form.setFieldsValue({
              secretary: !response.res.secretary ? 0 : 1,
            });
          }
        );
      }
    },
    handleCancel() {
      this.$emit("cancel");
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          updateUser(values).then((response) => {
            this.$message.info(response.message);
            this.$emit("ok");
          });
        }
        this.confirmLoading = false;
      });
    },
  },
};
</script>
