<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-row :gutter="64">
        <a-col :span="12">
          <a-form-item label="标题">
            <a-input
              placeholder="请输入标题"
              v-decorator="[
                'title',
                {
                  rules: [
                    {
                      required: true,
                      min: 3,
                      message: '请输入至少三个字符的规则！',
                    },
                  ],
                },
              ]"
            />
            <a-input type="hidden" v-decorator="['id']" />
            <a-input type="hidden" v-decorator="['typeid']" />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item label="排序">
            <a-input-number
              placeholder="排序，数字大在前"
              v-decorator="[
                'sort',
                {
                  rules: [{ required: false, message: '请输入数字' }],
                  initialValue: 0,
                },
              ]"
            />
          </a-form-item>
        </a-col> -->
        <a-col :span="12">
          <a-form-item label="结束时间">
            <a-date-picker
              style="width: 100%"
              v-decorator="[
                'endtime',
                { rules: [{ required: true, message: '结束时间' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <div>
        <a-row :gutter="64">
          <a-col :span="12" v-if="temptypeid == 2">
            <a-form-item label="类型">
              <a-select
                :allowClear="true"
                v-decorator="[
                  'itemtype',
                  { rules: [{ required: true, message: '请选择类型' }] },
                ]"
                placeholder="请选择"
              >
                <a-select-option value="0">在线培训</a-select-option>
                <a-select-option value="1">集中培训</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12"></a-col>
        </a-row>
        <a-row :gutter="64">
          <a-col :span="12">
            <a-form-item label="展示图片">
              <a-input type="hidden" v-decorator="['imgurl']" />
              <a-upload
                name="file"
                :action="uploadUrl"
                :headers="headers"
                listType="picture-card"
                :fileList="fileList"
                :remove="removeFile"
                @preview="handlePreview"
                @change="handleFileChange"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="视频上传">
              <a-input type="hidden" v-decorator="['videourl']" />
              <a-upload
                name="file"
                :action="uploadUrl"
                :headers="headers"
                listType="picture-card"
                :fileList="videoList"
                :remove="removeVideo"
                @change="handleVideoChange"
              >
                <div v-if="videoList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传视频</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <!-- <a-row :gutter="64">
        <a-col :span="24">
          <a-form-item label="人员选择">
            <a-input-search
              placeholder=""
              enter-button
              @search="userSearch()"
              :readOnly="true"
              v-model="checkUserNameStr"
            />
            <br />
          </a-form-item>
        </a-col>
      </a-row> -->
      <div style="width: 106%; margin-left: -27px">
        <editor ref="tinymce1" :ctlId="editorId"></editor>
      </div>
    </a-form>
    <!-- <bind-user ref="bindUser" @bind="handleUserBindConfirm"></bind-user> -->
    <!-- <a-modal
      width="300px"
      v-if="userSearchVisible"
      title="人员选择"
      :visible="userSearchVisible"
      :confirm-loading="userSearchLoading"
      @ok="userSearchOk"
      @cancel="userSearchCancel"
    >
      <a-tree
        v-model="userCheckedKeys"
        checkable
        :expanded-keys="userExpandedKeys"
        :auto-expand-parent="userAutoExpandParent"
        :selected-keys="userSelectedKeys"
        :tree-data="userTreeDatas"
        @expand="userOnExpand"
        @select="userOnSelect"
        @check="userOnCheck"
      />
    </a-modal> -->
  </a-spin>
</template>
<script>
import { ApiUrl } from "@/utils/request.js";
import { save, getById, update, selectUsers } from "@/api/activity";
import { bindActivity } from "@/api/system/user";
import pick from "lodash.pick";
import store from "@/store";
import { deleteFile } from "@/api/resource/index";
import Editor from "@/components/Tinymce/Tinymce.vue";

export default {
  components: {
    Editor,
    // bindUser,
  },
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
      videoList: [],
      headers: {
        Authorization: "bearer  " + store.getters.token,
      },
      contents: "",
      userSearchVisible: false,
      userSearchLoading: false,
      groupSearchVisible: false,
      groupSearchLoading: false,
      userExpandedKeys: [],
      userAutoExpandParent: true,
      userCheckedKeys: [],
      userSelectedKeys: [],
      groupExpandedKeys: [],
      groupAutoExpandParent: true,
      groupCheckedKeys: [],
      groupSelectedKeys: [],
      userTreeDatas: [],
      checkUserNames: [],
      checkUserIds: [],
      checkUserNameStr: "",
      temptypeid: 1,
      editorId: new Date().getTime() + "-editor",
    };
  },
  created() {},
  methods: {
    add(typeid) {
      this.modal("新建活动", 0);
      this.fileList = [];
      this.videoList = [];
      this.form.setFieldsValue({ typeid: typeid });
      this.form.setFieldsValue({ itemtype: "0" });
      this.temptypeid = typeid;
      this.userSelectedKeys = [];
      this.userCheckedKeys = [];
      this.checkUserIds = [];
      this.checkUserNames = [];
    },
    edit(record) {
      this.modal("编辑活动", 1);
      this.activityId = record.id;
      getById({ id: record.id }).then((response) => {
        var result = response.res;
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(result, "id", "typeid", "title", "endtime")
          );
          this.temptypeid = record.typeid;
          this.form.setFieldsValue({ itemtype: record.itemtype + "" });
          if (result.imgurl) {
            this.fileList = [
              {
                uid: result.id,
                name: "imgurl",
                status: "done",
                url: result.imgurl,
              },
            ];
          }
          if (result.videourl) {
            this.videoList = [
              {
                uid: result.id + "vv",
                name: "videourl",
                status: "done",
                url: result.videourl,
              },
            ];
          }
          this.$refs.tinymce1.setContent(result.contents || "");
          this.checkUserIds = result.userids || [];
          this.checkUserNames = result.usernames || [];
          this.userCheckedKeys = result.userids || [];
        }, 100);
      });
    },
    modal(title, opera) {
      this.modalTitle = title;
      this.modalOpera = opera;
      this.visible = true;
      this.form.resetFields();
      this.checkUserIds = [];
      this.checkUserNames = [];
      this.activityId = "";
      this.$refs.tinymce1.setContent("");
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this;
      this.confirmLoading = true;
      const that = this;
      validateFields((errors, values) => {
        if (!errors) {
          const editorContent = this.$refs.tinymce1.getContent();
          values["contents"] = editorContent;
          if (this.modalOpera === 0) {
            values["userids"] = this.checkUserIds.join(",");
            save(values).then((response) => {
              this.$message.info(response.message);
              this.$emit("ok");
              this.handleCancel();
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
    handleFileChange(e) {
      this.fileList = e.fileList;
      if (e.file.response && e.file.response.code === 0) {
        this.disable = true;
        setTimeout(() => {
          this.form.setFieldsValue({
            imgurl: e.file.response.res.fileFullPath,
          });
        }, 100);
      }
      console.log(this.fileList);
      // console.log("----------------");
    },
    removeFile(file) {
      this.disable = false;
      if (file && !file.error && file.response) {
        deleteFile({
          filePath: file.response.res.path,
        }).then((response) => {
          if (response.code === 0) {
            // console.log("delete file success");
          }
        });
      }
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
      window.open(file.url, "_blank");
    },
    handleVideoChange(e) {
      this.videoList = e.fileList;
      if (e.file.response && e.file.response.code === 0) {
        this.disable = true;
        setTimeout(() => {
          this.form.setFieldsValue({
            videourl: e.file.response.res.fileFullPath,
          });
        }, 100);
      }
    },
    removeVideo(file) {
      this.disable = false;
      if (file && !file.error && file.response) {
        deleteFile({
          filePath: file.response.res.path,
        }).then((response) => {
          if (response.code === 0) {
            // console.log("delete file success");
          }
        });
      }
    },
    userSearch() {
      this.$refs.bindUser.visible = true;
      this.$refs.bindUser.title = "人员选择";
      this.$refs.bindUser.queryParam.dto.foreignId = this.activityId;
      this.$nextTick(() => {
        this.$refs.bindUser.refreshTable();
      });
    },
    userSearchOk() {
      console.log(this.userCheckedKeys);
      this.userSearchVisible = false;
      if (this.userCheckedKeys && this.userCheckedKeys.length > 0) {
      } else {
      }
    },
    userSearchCancel() {
      this.userSearchVisible = false;
    },
    groupSearchOk() {},
    groupSearchCancel() {},
    userOnExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      this.userExpandedKeys = expandedKeys;
      this.userAutoExpandParent = false;
    },
    userOnCheck(checkedKeys, info) {
      const that = this;
      that.checkUserNames = [];
      that.checkUserIds = [];
      console.log("onCheck", checkedKeys);
      console.log("onCheck2", info);
      that.userCheckedKeys = checkedKeys;
      var nodes = info.checkedNodes;
      if (nodes && nodes.length > 0) {
        var tempnames = [];
        var tempuserids = [];
        nodes.forEach((n) => {
          if (n.key.indexOf("org") < 0) {
            tempnames.push(n.data.props.title);
            tempuserids.push(n.key);
          }
        });
        that.checkUserNames = tempnames;
        that.checkUserIds = tempuserids;
      }
      console.log("onCheck3", nodes);
      console.log("onCheck4", this.checkUserNames);
    },
    userOnSelect(selectedKeys, info) {
      this.userSelectedKeys = selectedKeys;
    },
    groupOnExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      this.groupExpandedKeys = expandedKeys;
      this.groupAutoExpandParent = false;
    },
    groupOnCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.groupCheckedKeys = checkedKeys;
    },
    groupOnSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.groupSelectedKeys = selectedKeys;
    },
    getUser() {
      selectUsers({}).then((response) => {
        var result = response.res;
        console.log(result);
        this.userTreeDatas = result;
        console.log(this.userCheckedKeys);
        console.log("fsdfsdfsdf");
      });
    },
    handleUserBindConfirm(__data) {
      if (__data && __data.foreignId) {
        this.checkUserNames = _.concat(this.checkUserNames, __data.realNames);
        bindActivity(__data).then((response) => {
          if (response.code === 0 && response.res) {
            this.$message.info(response.message);
            this.$refs.bindUser.refreshTable();
          } else {
            this.$message.error("操作失败");
          }
        });
      } else {
        this.checkUserNames = _.concat(this.checkUserNames, __data.realNames);
        this.checkUserIds = _.concat(this.checkUserIds, __data.userIds);
      }
    },
  },
  watch: {
    checkUserNames(newName, oldName) {
      this.checkUserNameStr = newName.join(",");
    },
  },
};
</script>
