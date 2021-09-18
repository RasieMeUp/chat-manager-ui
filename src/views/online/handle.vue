<template>
  <a-modal
    :title="modalTitle"
    :width="1100"
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
        </a-form-item>

        <a-row :gutter="12">
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
            <a-form-item label="作者" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['author',{rules: [{required: true, message: '请输入作者！'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
            <a-form-item label="模块名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['modelName',{rules: [{required: true, message: '模块名称！'}]}]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
            <a-form-item label="是否覆盖" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['fileOverride', {rules: [{required: true, message: '请选择是否覆盖'}]}]"
              >
                <a-radio :value="1">是</a-radio>
                <a-radio :value="2">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
            <a-form-item label="Controller 路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['controllerPosition', {rules: [{required: true, min: 3, message: '请输入路径！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
            <a-form-item label="Api 路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['apiPosition', {rules: [{required: true, min: 3, message: '请输入路径！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
            <a-form-item label="Service 路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['servicePosition', {rules: [{required: true, min: 3, message: '请输入路径！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
            <a-form-item label="Entity 路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['entityPosition', {rules: [{required: true, min: 3, message: '请输入路径！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
            <a-form-item label="Mapper 路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['mapperPosition', {rules: [{required: true, min: 3, message: '请输入路径！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
            <a-form-item label="Dto 路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['dtoPosition', {rules: [{required: true, min: 3, message: '请输入路径！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
            <a-form-item label="VUE脚本路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['vueJsPosition', {rules: [{required: true, min: 3, message: '请输入路径！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
            <a-form-item label="VUE页面 路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['vuePagePosition', {rules: [{required: true, min: 3, message: '请输入路径！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
            <a-form-item label="表描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['tableNote', {rules: [{required: true, min: 3, message: '请输入表描述！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update, saerchAuthor } from "@/api/online";
import pick from "lodash.pick";
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
      parentName: "根目录",
      author: "",
      form: this.$form.createForm(this)
    };
  },
  created() {},
  methods: {
    add(record) {
      this.modal("新建表", 0);
      if (record) {
        this.parentName = record.name;
        this.apivisible = true;
        this.setVal(record.id, record.attributes.type + 1);
      } else {
        this.parentName = "根目录";
        this.apivisible = false;
        this.setVal("ROOT", 0);
      }
    },
    setVal(parentId, type) {
      setTimeout(() => {
        this.form.setFieldsValue({ parentId: parentId });
        this.form.setFieldsValue({ type: type });
      }, 100);
    },
    edit(record) {
      this.modal("编辑表", 1);
      getById({ id: record.id }).then(response => {
        const result = response.res;
        this.apivisible = result.type !== 0;
        this.parentName = result.parentName;
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(
              result,
              "id",
              "apiPosition",
              "modelName",
              "author",
              "controllerPosition",
              "servicePosition",
              "apiPosition",
              "dtoPosition",
              "entityPosition",
              "fileOverride",
              "mapperPosition",
              "vueJsPosition",
              "vuePagePosition",
              "xmlPosition",
              "tableNote"
            )
          );
        }, 200);
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
    }
  }
};
</script>
