<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="父级区域" :labelCol="labelCol" v-show="false">
        <a-input v-decorator="['id']" />
        <a-input v-decorator="['typeId']" />
      </a-form-item>
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-model="name" :disabled="true" />
      </a-form-item>
      <a-form-item label="分值" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'integral',
            {
              rules: [{ required: true, message: '请输入分值！' }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="当日最多"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'dayMax',
            {
              rules: [{ required: true, message: '请输入当日最多！' }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="是否可用"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          v-decorator="[
            'status',
            {
              rules: [{ required: true, message: '请选择是否可用' }],
              initialValue: 1,
            },
          ]"
        >
          <a-radio :value="0">否</a-radio>
          <a-radio :value="1">是</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
import { info, save, update } from "@/api/system/integral";
import store from "@/store";
import pick from "lodash.pick";
import random from "lodash.random";
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      apivisible: false,
      confirmLoading: false,
      parentName: "根目录",
      form: this.$form.createForm(this),
      name: "",
    };
  },
  created() {},
  methods: {
    edit(record) {
      const that = this;
      this.form.resetFields();
      this.name = record.name;
      info({
        name: record.name,
        typeId: record.typeId,
        id: !record.id ? "N/A" : record.id,
      }).then((response) => {
        const result = response.res;
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(result, "id", "dayMax", "typeId", "integral")
          );
          this.form.setFieldsValue({
            status: !result.status ? 0 : 1,
          });
        }, 100);
      });
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          values.dayMax = Number(values.dayMax);
          values.integral = Number(values.integral);
          if (!values.id) {
            delete values.id;
            save(values).then((response) => {
              if (response.code === 0) {
                this.$message.info(response.message);
                this.$emit("ok");
                this.handleCancel();
              } else {
                this.$message.error(response.message);
              }
            });
          } else {
            update(values).then((response) => {
              if (response.code === 0) {
                this.$message.info(response.message);
                this.$emit("ok");
                this.handleCancel();
              } else {
                this.$message.error(response.message);
              }
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
  },
};
</script>
