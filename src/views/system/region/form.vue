<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="父级区域" :labelCol="labelCol" v-show="false">
        <a-input v-decorator="['parentId']" />
        <a-input v-decorator="['level']" />
      </a-form-item>
      <a-form-item
        label="父级区域"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-model="parentName" :readOnly="true" />
      </a-form-item>
      <a-form-item
        label="区域名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'orgName',
            {
              rules: [
                {
                  required: true,
                  min: 2,
                  message: '请输入至少2个字符的区域名称！',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="区域编号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-if="modalOpera == 0"
          v-decorator="[
            'id',
            {
              rules: [
                {
                  required: true,
                  min: 4,
                  message: '请输入至少四个字符的规则描述！',
                },
              ],
            },
          ]"
        />
        <a-input
          v-if="modalOpera == 1"
          v-decorator="['id', { rules: [{ required: false }] }]"
          :disabled="true"
        />
      </a-form-item>
      <a-form-item
        label="区域备注"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          type="textarea"
          v-decorator="[
            'comment',
            {
              rules: [
                {
                  required: false,
                  min: 3,
                  message: '请输入至少五个字符的规则描述！',
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
import { save, getById, update } from "@/api/system/org";
import pick from "lodash.pick";
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
    };
  },
  created() {},
  methods: {
    add(record) {
      this.modal("新建区域", 0);
      if (record) {
        this.parentName = record.name;
        this.setVal(record.id, record.attributes.type + 1, record.level + 1);
      } else {
        this.parentName = "根目录";
        this.setVal("0", "330500000000", 0);
      }
    },
    setVal(parentId, type, __level) {

      this.$nextTick(() => {
        this.form.setFieldsValue({
          parentId: parentId,
          level: __level,
        });
      }, 100);
    },
    edit(record) {
      const that = this;
      this.modal("编辑区域", 1);
      getById({ id: record.id }).then((response) => {
        const result = response.res;
        this.parentName = result.parentName;
        that.$nextTick(() => {
          this.form.setFieldsValue(
            pick(result, "id", "orgName", "comment", "parentId", "level")
          );
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
