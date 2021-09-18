<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" layout="vertical">
          <a-form-item label="业务ID" v-show="false">
            <a-input v-decorator="['id']" />
            <a-input v-decorator="['orgId']" />
          </a-form-item>
          <a-form-item label="三务公开">
            <a-input
              v-decorator="[
                'swgkUrl',
                {
                  rules: [
                    {
                      min: 3,
                      message: '请输入至少三个字符的规则！',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="垃圾分类">
            <a-input
              v-decorator="[
                'ljflUrl',
                {
                  rules: [
                    {
                      min: 3,
                      message: '请输入至少三个字符的规则！',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-button @click="handleSubmit" v-has="{ perm: 'app:link:save' }"
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
import { save, getByOrgId } from "@/api/system/orgConfig";
import pick from "lodash.pick";
export default {
  data() {
    return {
      modalOpera: 0, //0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
    };
  },
  components: {},
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getByOrgId().then((response) => {
        this.form.setFieldsValue(
          pick(response.res, "id", "swgkUrl", "ljflUrl", "orgId")
        );
      });
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          save(values).then((response) => {
            this.$message.info(response.message);
          });
        }
        this.confirmLoading = false;
      });
    },
  },
};
</script>
