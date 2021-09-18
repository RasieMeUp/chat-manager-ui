<template>
  <a-card :bordered="false">
    <template>
      <div class="table-operator">
        <a-button
          type="primary"
          icon="plus"
          v-has="{ perm: 'struct:save' }"
          @click="handleForm(0, null)"
          >添加机构</a-button
        >
      </div>
    </template>

    <div class="table-page-search-wrapper">
      <a-table :columns="columns" :dataSource="data">
        <span slot="action" slot-scope="text, record">
          <template>
            <a-tag
              color="green"
              @click="handleForm(0, record)"
              v-has="{ perm: 'struct:save' }"
              >添加子项</a-tag
            >
            <a-tag
              color="orange"
              @click="handleForm(1, record)"
              v-has="{ perm: 'struct:update' }"
              >编辑</a-tag
            >
            <a-tag
              color="red"
              @click="handleDelete(record)"
              v-has="{ perm: 'struct:delete' }"
              >删除</a-tag
            >
            <a-tag
              color="#87d068"
              @click="handleBind(record)"
              v-has="{ perm: 'struct:delete' }"
              >村民绑定</a-tag
            >
          </template>
        </span>
      </a-table>
      <a-drawer
        :title="drawer01.title"
        :width="drawer01.width"
        :maskClosable="false"
        :visible="drawer01.visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="
          () => {
            drawer01.visible = false;
          }
        "
      >
        <form-struct ref="formStruct" @ok="handleOk" />
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button
            :style="{ marginRight: '8px' }"
            @click="
              () => {
                drawer01.visible = false;
              }
            "
            >取消</a-button
          >
          <a-button
            type="primary"
            @click="
              () => {
                $refs.formStruct.handleSubmit();
              }
            "
            >确定</a-button
          >
        </div>
      </a-drawer>
    </div>
    <bind-user ref="bindUser" @bind="handleUserBindConfirm"></bind-user>
  </a-card>
</template>

<script>
import { page, delByPk } from "@/api/system/struct";
import { bind } from "@/api/system/user";
import formStruct from "./form";
import moment from "moment";
import bindUser from "@/views/zmdj/struct/modal";
const columns = [
  {
    title: "机构名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "机构代码",
    dataIndex: "id",
    key: "id",
    width: "16%",
  },
  {
    title: "创建时间",
    dataIndex: "attributes.createTime",
    width: "16%",
    sorter: true,
    needTotal: false,
    customRender: (text) => {
      if (text) return moment(text).format("YYYY-MM-DD");
    },
  },
  {
    title: "操作",
    dataIndex: "",
    key: "x",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};
export default {
  data() {
    return {
      data: [],
      columns,
      rowSelection,
      drawer01: {
        visible: false,
        width: "600",
        placement: "right",
        title: "添加机构",
      },
    };
  },
  components: {
    formStruct,
    bindUser,
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      return page({}).then((response) => {
        this.data = response.res.children;
      });
    },
    handleForm(__type, __record) {
      this.drawer01.visible = true;
      this.drawer01.title = __type == 0 ? "添加机构" : "编辑机构";
      this.$nextTick(() => {
        if (__type == 1) this.$refs.formStruct.edit(__record);
        else this.$refs.formStruct.add(__record);
      });
    },
    handleAssign(record) {
      this.$refs.formHandleOrg.assignColumn(record);
    },
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要删除吗?",
        onOk() {
          delByPk({ id: record.id }).then((response) => {
            if (response.code === 0) {
              that.$message.info(response.message);
              that.handleOk();
            } else {
              that.$message.error(response.message);
            }
          });
        },
        onCancel() {},
      });
    },
    handleOk() {
      this.loadData();
      this.drawer01.visible = false;
    },
    handleBind(__record) {
      if (__record) {
        this.$refs.bindUser.visible = true;
        this.$refs.bindUser.title =
          "选择村民绑定至机构【" + __record.name + "】";
        this.$refs.bindUser.queryParam.dto.foreignId = __record.id;
        this.$nextTick(() => {
          this.$refs.bindUser.refreshTable();
        });
      }
    },
    handleUserBindConfirm(__data) {
      bind(__data).then((response) => {
        if (response.code === 0 && response.res) {
          this.$message.info(response.message);
          this.$refs.bindUser.refreshTable();
        } else {
          this.$message.error("操作失败");
        }
      });
    },
  },
};
</script>
