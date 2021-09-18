<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="父级区域" :labelCol="labelCol" v-show="false">
        <a-input v-decorator="['userId']" />
      </a-form-item>
      <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group
          v-decorator="[
            'typeId',
            {
              rules: [{ required: true, message: '请选择类型' }],
              initialValue: -9,
            },
          ]"
          @change="handleChange"
        >
          <a-radio :value="9">增加</a-radio>
          <a-radio :value="-9">扣除</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="分值" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          type="number"
          v-decorator="[
            'integral',
            {
              rules: [
                {
                  required: true,
                  type: 'number',
                  min: 1,
                  max: 100,
                  message: '请输入有效的分值！',
                  transform(value) {
                    return Number(value);
                  },
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="备注"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="remark.show"
      >
        <a-textarea
          :rows="4"
          v-decorator="[
            'remark',
            {
              rules: [
                {
                  required: remark.required,
                  min:2,
                  message: '请输入至少2个字符的备注！',
                },
              ],
            },
          ]"
        />
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
import { operate } from "@/api/system/integral";
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
      parentName: "根目录",
      form: this.$form.createForm(this),
      name: "",
      showRemark: true,
      remark: {
        show: true,
        required: true,
      },
    };
  },
  created() {},
  methods: {
    edit(record) {
      const that = this;
      this.form.resetFields();
      this.form.setFieldsValue({
        userId: record.id,
      });
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          values.integral = Number(values.integral);
          operate(values).then((response) => {
            if (response.code === 0) {
              this.$message.info(response.message);
              this.$emit("ok");
              this.handleCancel();
            } else {
              this.$message.error(response.message);
            }
          });
        }
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
    },
    handleChange(e) {
      if (e.target.value == -9) {
        this.remark.show = true;
        this.remark.required = true;
      } else {
        this.remark.show = false;
        this.remark.required = false;
      }
    },
  },
};
</script>
