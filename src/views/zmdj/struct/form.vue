<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="父级区域" :labelCol="labelCol" v-show="false">
        <a-input v-decorator="['parentId']" />
        <a-input v-decorator="['level']" />
      </a-form-item>
      <a-form-item
        label="归属区域"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-model="orgName" :disabled="true" />
      </a-form-item>
      <a-form-item
        label="父级机构"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-model="parentName" :disabled="true" />
      </a-form-item>
      <a-form-item
        label="机构名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
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
        label="机构编号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-if="modalOpera == 0"
          type="number"
          v-decorator="[
            'id',
            {
              rules: [
                { required: true, min: 4, message: '请输入至少4个字符！' },
              ],
            },
          ]"
          :disabled="true"
        />
        <a-input
          v-if="modalOpera == 1"
          v-decorator="['id', { rules: [{ required: false }] }]"
          :disabled="true"
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
import { save, getById, update } from "@/api/system/struct";
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
      orgName: "",
      orgId: null,
    };
  },
  created() {
    this.orgName = store.getters.orgName;
    this.orgId = store.getters.orgId;
  },
  methods: {
    add(record) {
      this.modal(0);
      if (record) {
        this.parentName = record.name;
        this.setVal(
          record.id,
          record.id + random(100, 500),
          record.level + 1,
          record.typeId
        );
      } else {
        this.parentName = "根目录";
        this.setVal(0, this.orgId + random(100, 500), 0, 0);
      }
    },
    setVal(__parentId, __structId, __level, __typeId) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          parentId: __parentId,
          id: __structId,
          level: __level,
          typeId: __typeId,
        });
      });
    },
    edit(record) {
      const that = this;
      this.modal(1);
      getById({ id: record.id }).then((response) => {
        const result = response.res;
        this.parentName = result.parentName;
        setTimeout(() => {
          this.form.setFieldsValue(pick(result, "id", "name", "parentId"));
        }, 100);
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
