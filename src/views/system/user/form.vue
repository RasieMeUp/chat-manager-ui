<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item
        label="用户ID"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-show="false"
      >
        <a-input v-if="modalOpera == 0" v-decorator="['id']" />
        <a-input v-decorator="['manager']" v-show="false"/>
        <a-input
          v-if="modalOpera == 1"
          v-decorator="['id', { rules: [{ required: true }] }]"
        />
      </a-form-item>

      <a-row :gutter="12">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item
            label="区域隶属"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-tree-select
              v-decorator="[
                'orgId',
                { rules: [{ required: true, message: '请选择区域' }] },
              ]"
              :treeData="treeData"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              placeholder="请选择区域"
              allowClear
            ></a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item
            label="机构隶属"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-tree-select
              v-decorator="[
                'structId',
                { rules: [{ required: validStruct, message: '请选择机构' }] },
              ]"
              :treeData="treeStructData"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              placeholder="请选择机构"
              allowClear
            ></a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <a-form-item
            label="登录账号"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              :disabled="modalOpera == 1"
              v-decorator="[
                'loginName',
                {
                  rules: [
                    { required: true, min: 5, message: '请输入至少五个字符' },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item
            label="真实姓名"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'realName',
                {
                  rules: [
                    { required: true, min: 2, message: '请输入至少二个字符' },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <!-- <a-form-item
            label="固定电话"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="['fiexdtel', { rules: [{ required: false }] }]"
            />
          </a-form-item> -->
          <a-form-item
            label="用户手机"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'mobile',
                {
                  rules: [
                    {
                      required: false,
                      min: 11,
                      max: 11,
                      message: '请输入正确的手机号',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item
            label="身份证号"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'idCard',
                {
                  rules: [
                    {
                      required: false,
                      min: 18,
                      max: 18,
                      message: '请输入正确的身份证号',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12" v-show="false">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <!-- <a-form-item
            label="用户邮箱"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'email',
                {
                  rules: [
                    { required: false, min: 5, message: '请输入至少五个字符' },
                    { type: 'email', message: '请输入正确的邮箱' },
                  ],
                },
              ]"
            />
          </a-form-item> -->
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <a-form-item
            label="登录密码"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: modalOpera == 0,
                      min: 5,
                      message: '请输入至少五个字符',
                    },
                  ],
                },
              ]"
              :disabled="modalOpera == 1"
              type="password"
            />
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item
            label="用户性别"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group
              v-decorator="[
                'sex',
                {
                  rules: [{ required: true, message: '请选择性别' }],
                  initialValue: 1,
                },
              ]"
            >
              <a-radio :value="1">男</a-radio>
              <a-radio :value="0">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <a-form-item
            label="出生年月"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-date-picker
              style="width: 100%"
              v-decorator="[
                'birth',
                { rules: [{ required: false, message: '请选择出生年月' }] },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item
            label="文化程度"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              v-decorator="[
                'education',
                { rules: [{ required: false, message: '请选择文化程度' }] },
              ]"
            >
              <a-select-option v-for="i in educations" :key="i.value">{{
                i.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="12">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 12 }">
          <a-form-item
            label="是否党员"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group
              v-decorator="[
                'party',
                {
                  rules: [{ required: true, message: '请选择是否党员' }],
                  initialValue: 0,
                },
              ]"
              @change="partyChangeEvent"
            >
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item
            label="入党时间"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-date-picker
              style="width: 100%"
              v-decorator="[
                'addPartyDate',
                { rules: [{ required: validPart, message: '请选择入党时间' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="12">
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
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
                  initialValue: 0,
                },
              ]"
            >
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :xl="{ span: 12 }" :lg="{ span: 12 }" :md="{ span: 24 }">
          <a-form-item
            label="用户角色"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              mode="multiple"
              placeholder="请选择角色"
              v-decorator="[
                'roleIds',
                { rules: [{ required: true, message: '请选择用户角色' }] },
              ]"
            >
              <a-select-option
                v-for="(role, index) in roles"
                :key="index"
                :value="role.id"
                >{{ role.roleName }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>

<script>
import moment from "moment";
import { save, getById, update, selectRoles } from "@/api/system/user";
import { selectType } from "@/api/system/dict";
import { page as pageOrg } from "@/api/system/org";
import { page as pageStruct } from "@/api/system/struct";
import pick from "lodash.pick";
import store from "@/store";
export default {
  name: "form-user",
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
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      roles: [],
      treeData: [],
      treeStructData: [],
      form: this.$form.createForm(this),
      org: "",
      educations: [],
      validPart: false,
      validStruct: true,
    };
  },
  created() {
    this.loadTreeData();
    this.getRoles({});
    this.getDicts("WHCD");
    let orgId = store.getters.orgId;
    if (orgId && orgId == "330523000000") {
      this.validStruct = false;
    }
  },
  methods: {
    add() {
      this.modal(0);
    },
    edit(record) {
      this.modal(1);
      getById({ id: record.id }).then((response) => {
        this.form.setFieldsValue(
          pick(
            response.res,
            "id",
            "realName",
            "loginName",
            "sex",
            // "email",
            "mobile",
            "birth",
            "roleIds",
            "orgId",
            "structId",
            "idCard",
            // "fiexdtel",
            "education"
            // "party",
          )
        );
        this.form.setFieldsValue({
          birth: moment(response.res.brith),
          addPartyDate: response.res.addPartyDate
            ? moment(response.res.addPartyDate)
            : "",
          party: !response.res.party ? 0 : 1,
          status: !response.res.status ? 0 : 1,
          manager: 1,
        });
      });
    },
    modal(opera) {
      this.modalOpera = opera;
      this.form.resetFields();
      this.validPart = false;
    },
    getRoles(obj) {
      selectRoles().then((response) => {
        this.roles = response.res;
      });
    },
    getDicts(__type) {
      selectType({ type: __type }).then((response) => {
        this.educations = response.res;
      });
    },
    loadTreeData() {
      pageOrg({}).then((response) => {
        if (response.res.children.length > 0) {
          this.treeData = response.res.children;
        } else {
          this.treeData = [response.res];
        }
      });

      pageStruct({}).then((response) => {
        this.treeStructData = response.res.children;
      });
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
    partyChangeEvent(e) {
      this.validPart = e.target.value === 0 ? false : true;
    },
  },
};
</script>
