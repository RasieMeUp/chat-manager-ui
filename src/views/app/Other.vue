<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" layout="vertical">
          <a-form-item label="业务ID" v-show="false">
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-form-item label="需求审核">
            <a-switch
              v-decorator="['demandReview', { valuePropName: 'checked' }]"
              checked-children="开启"
              un-checked-children="关闭"
            />
          </a-form-item>
          <a-form-item label="评论审核">
            <a-switch
              v-decorator="['commentReview', { valuePropName: 'checked' }]"
              checked-children="开启"
              un-checked-children="关闭"
            />
          </a-form-item>
          <a-form-item label="政治生日祝福模板">
            <a-textarea
              :rows="4"
              v-decorator="[
                'blessTemplete',
                {
                  rules: [
                    {
                      required: false,
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
import { save, getById } from "@/api/system/config";
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
      getById({ pk: "502864079027699713" }).then((response) => {
        this.form.setFieldsValue(
          pick(response.res, "id", "demandReview", "commentReview","blessTemplete")
        );

        // this.form.setFieldsValue({
        //   birth: moment(response.res.brith),
        //   addPartyDate: response.res.addPartyDate
        //     ? moment(response.res.addPartyDate)
        //     : "",
        //   party: !response.res.party ? 0 : 1,
        //   status: !response.res.status ? 0 : 1,
        //   manager: 1,
        // });
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
