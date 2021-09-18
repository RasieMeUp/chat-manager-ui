<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="父级区域" :labelCol="labelCol" v-show="false">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: true, min: 2, message: '请输入至少2个字符！' },
              ],
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
import { save, getById, update } from "@/api/system/party";
import store from "@/store";
import pick from "lodash.pick";
import random from "lodash.random";
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
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
      form: this.$form.createForm(this),
    };
  },
  created() {},
  methods: {
    add(record) {
      this.modal(0);
    },
    edit(record) {
      const that = this;
      this.modal(1);
      getById({ id: record.id }).then((response) => {
        const result = response.res;
        this.form.setFieldsValue(pick(result, "id", "name"));
        this.form.setFieldsValue({
          status: !response.res.status ? 0 : 1,
        });
      });
    },
    modal(opera) {
      this.modalOpera = opera;
      this.form.resetFields();
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          if (this.modalOpera === 0) {
            save(values).then((response) => {
              if (response.code === 0) {
                this.$message.info(response.message);
                this.$emit("ok");
                this.handleCancel();
              } else {
                this.$message.error(response.message);
              }
            });
          } else if (this.modalOpera === 1) {
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
