<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item label="网格名称">
        <a-input
          placeholder="请输入网格名称"
          v-decorator="[
            'title',
            {
              rules: [
                {
                  required: true,
                  min: 2,
                  message: '请输入至少2个字符的规则！',
                },
              ],
            },
          ]"
        />
        <a-input type="hidden" v-decorator="['id']" />
        <a-input type="hidden" v-decorator="['adminid']" />
      </a-form-item>
      <a-form-item label="网格长">
        <a-input-search
          placeholder=""
          enter-button
          @search="userSearch()"
          v-model="checkUserNameStr"
        />
        <br />
      </a-form-item>
      <a-form-item label="备注信息">
        <a-textarea
          :rows="4"
          v-decorator="[
            'remarks',
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
    </a-form>
    <a-modal
      width="300px"
      v-if="userSearchVisible"
      title="人员选择"
      :visible="userSearchVisible"
      :confirm-loading="userSearchLoading"
      @ok="userSearchOk"
      @cancel="userSearchCancel"
    >
      <a-tree
        show-line
        v-model="userCheckedKeys"
        :expanded-keys="userExpandedKeys"
        :auto-expand-parent="userAutoExpandParent"
        :selected-keys="userSelectedKeys"
        :tree-data="userTreeDatas"
        @expand="userOnExpand"
        @select="userOnSelect"
        @check="userOnCheck"
      />
    </a-modal>
  </a-spin>
</template>
<script>
import { ApiUrl } from "@/utils/request.js";
import { save, getById, update } from "@/api/grid";
import pick from "lodash.pick";
import store from "@/store";
import { selectUsers } from "@/api/system/searchuser";
export default {
  components: {},
  data() {
    return {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      uploadUrl: ApiUrl + "/upload/uploadFile",
      fileList: [],
      headers: {
        Authorization: "bearer  " + store.getters.token,
      },
      checkUserNameStr: "",
      userTreeDatas: [],
      userSearchVisible: false,
      userSearchLoading: false,
      userExpandedKeys: [],
      userAutoExpandParent: true,
      userCheckedKeys: [],
      userSelectedKeys: [],
      searchUserNames: [],
      searchUserIds: [],
    };
  },
  created() {},
  mounted() {},
  methods: {
    add(categoryid) {
      this.modal("新建", 0);
      this.searchUserNames = [];
      this.userSelectedKeys = [];
      this.checkUserIds = [];
    },
    edit(record) {
      const that = this;
      that.modal("编辑", 1);
      getById({ pk: record.id }).then((response) => {
        var result = response.res;
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(result, "id", "title", "remarks", "adminid")
          );
          this.checkUserIds = [result.adminid] || [];
          this.searchUserNames = [result.adminName] || [];
          this.userSelectedKeys = [result.adminid] || [];
        });
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
          values["adminid"] = this.searchUserIds.join(",");
          if (this.modalOpera === 0) {
            save(values).then((response) => {
              this.$message.info(response.message);
              this.$emit("ok");
              this.handleCancel();
              this.fileList = [];
            });
          } else if (this.modalOpera === 1) {
            update(values).then((response) => {
              this.$message.info(response.message);
              this.$emit("ok");
              this.handleCancel();
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
    userSearch() {
      this.userSearchVisible = true;
      this.getUser();
    },
    userSearchOk() {
      console.log(this.userSelectedKeys);
      this.userSearchVisible = false;
    },
    userSearchCancel() {
      this.userSearchVisible = false;
    },
    userOnExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      this.userExpandedKeys = expandedKeys;
      this.userAutoExpandParent = false;
    },
    userOnCheck(checkedKeys, info) {},
    userOnSelect(selectedKeys, info) {
      const that = this;
      this.userSelectedKeys = selectedKeys;
      var nodes = info.selectedNodes;
      if (nodes && nodes.length > 0) {
        var tempnames = [];
        var tempuserids = [];
        nodes.forEach((n) => {
          if (n.key.indexOf("org") < 0) {
            tempnames.push(n.data.props.title);
            tempuserids.push(n.key);
          }
        });
        that.searchUserNames = tempnames;
        that.searchUserIds = tempuserids;
      }
      console.log(info);
    },
    getUser() {
      selectUsers({}).then((response) => {
        var result = response.res;
        console.log(result);
        this.userTreeDatas = result;
      });
    },
  },
  watch: {
    searchUserNames(newName, oldName) {
      this.checkUserNameStr = newName.join(",");
    },
  },
};
</script>
