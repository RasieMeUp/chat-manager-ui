<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="菜单ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
          <a-input v-if="modalOpera==0" v-decorator="['id']" />
          <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
          <a-input v-decorator="['parentId']" />
          <a-input v-decorator="['pathJoin']" />
        </a-form-item>
        <a-form-item label="父级菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-cascader
            :options="options"
            change-on-select
            placeholder="选择父级菜单"
            v-model="pathJoinArray"
            @change="onCascaderChange"
          />
        </a-form-item>
        <a-form-item label="菜单名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符的菜单名称！'}]}]"
          />
        </a-form-item>
        <a-form-item label="权限标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['perms', {rules: [{required: true, min: 4, message: '请输入至少四个字符的规则描述！'}]}]"
          />
        </a-form-item>
        <a-form-item label="菜单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group name="radioGroup" v-decorator="['type', {rules: [{required: false}],initialValue:0}]">
            <a-radio :value="item.value" v-for="item in menuTypeEnum" :key="item.key">{{item.key}}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="菜单顺序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            style="width: 100%;"
            :min="0"
            :max="1000"
            v-decorator="['orderNum',{rules: [{required: true, message: '请输入顺序'}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update, cascader } from "@/api/system/menu";
import { menuTypeEnum } from "@/config/enums";
import pick from "lodash.pick";
import join from "lodash.join";
import last from "lodash.last";
import clone from "lodash.clone";
import _ from "lodash";
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      apivisible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      options: [],
      menuTypeEnum,
      pathJoinArray: []
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      cascader({}).then(response => {
        this.options = response.res.children;
      });
    },
    add(record) {
      this.modal("新建菜单", 0);
      if (record) {
        this.apivisible = true;
        this.setVal(record.id, "");
      } else {
        this.apivisible = false;
        this.setVal("0", "");
        this.pathJoinArray=[];
      }
    },
    setVal(parentId, pathJoin) {
      const that = this;
      setTimeout(() => {
        that.form.setFieldsValue({ parentId: parentId });
        that.form.setFieldsValue({ pathJoin: pathJoin });
      }, 100);
    },
    edit(record) {
      this.modal("编辑菜单", 1);
      getById({ id: record.id }).then(response => {
        this.apivisible = response.res.type !== 0;
        const that = this;
        setTimeout(() => {
          that.form.setFieldsValue(
            pick(
              response.res,
              "id",
              "name",
              "perms",
              "parentId",
              "type",
              "pathJoin",
              "orderNum"
            )
          );
          that.pathJoinArray = response.res.pathJoin
            ? _.split(response.res.pathJoin,",")//_.map(_.split(response.res.pathJoin,","),(s)=>{return parseInt(s)})
            : [];
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
          if (this.modalOpera === 0) {
            save(values).then(response => {
              if (response.code === 0) {
                this.$message.info(response.message);
                this.$emit("ok");
                this.handleCancel();
              } else {
                this.$message.error(response.message);
              }
            });
          } else if (this.modalOpera === 1) {
            update(values).then(response => {
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
    onCascaderChange(value) {
      let that = this;
      if (value) {
        let cascaderValue = clone(value);
        that.setVal(last(cascaderValue), join(cascaderValue, ","));
      }
    }
  }
};
</script>
