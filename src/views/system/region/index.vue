<template>
  <a-card :bordered="false">
    <template>
      <div class="table-operator">
        <a-button
          type="primary"
          icon="plus"
          v-has="{perm:'region:save'}"
          v-if="false"
          @click="handleForm(0,null)"
        >新建区域</a-button>
      </div>
    </template>

    <div class="table-page-search-wrapper">
      <a-table :columns="columns" :dataSource="data">
        <!-- :rowSelection="rowSelection" -->
        <span slot="action" slot-scope="text, record">
          <template>
            <a-tag color="green" @click="handleForm(0,record)" v-has="{perm:'region:save'}">新增</a-tag>
            <a-tag color="orange" @click="handleForm(1,record)" v-has="{perm:'region:update'}">编辑</a-tag>
            <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'region:delete'}">删除</a-tag>
          </template>
        </span>
      </a-table>

      <a-drawer
        :title="drawer01.title"
        :width="drawer01.width"
        :maskClosable="false"
        :visible="drawer01.visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="()=>{drawer01.visible=false}"
      >
        <form-region ref="formRegion" @ok="handleOk" />
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
          <a-button :style="{ marginRight: '8px' }" @click="()=>{drawer01.visible=false}">取消</a-button>
          <a-button type="primary" @click="()=>{$refs.formRegion.handleSubmit()}">确定</a-button>
        </div>
      </a-drawer>
    </div>
  </a-card>
</template>

<script>
import { page, delByPk } from "@/api/system/org";
import formRegion from "./form";
import moment from "moment";

const columns = [
  {
    title: "区域名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "区域代码",
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
        title: "添加区域",
      },
    };
  },
  components: {
    formRegion,
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      return page({}).then((response) => {
        if(response.res.children.length>0)
        this.data = response.res.children;
        else
        this.data = [response.res];
      });
    },
    handleForm(__type, __record) {
      this.drawer01.visible = true;
      this.drawer01.title = __type == 0 ? "添加机构" : "编辑机构";
      this.$nextTick(() => {
        if (__type == 1) this.$refs.formRegion.edit(__record);
        else this.$refs.formRegion.add(__record);
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
  },
};
</script>
