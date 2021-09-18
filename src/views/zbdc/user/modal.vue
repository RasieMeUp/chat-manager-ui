<style>
.active {
  background: #1890ff;
}
</style>
<template>
  <a-modal
    :title="title"
    :width="800"
    :height="600"
    :maskClosable="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="真实姓名">
                  <a-input
                    v-model="queryParam.dto.realName"
                    placeholder
                    :allowClear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <span
                  class="table-page-search-submitButtons"
                  :style="
                    (advanced && { float: 'right', overflow: 'hidden' }) || {}
                  "
                >
                  <a-button type="primary" @click="refreshTable()">
                    <a-icon type="search" />查询
                  </a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- <a-divider /> -->
        <a-row :gutter="24">
          <a-col :md="8">
            <div style="border: 1px dashed #e8e8e8; position: relative">
              <a-tree
                @select="treeSelectEvent"
                :treeData="structTreeData"
                :show-line="true"
                ref="treeStruct"
              />
              <a-icon
                type="sync"
                style="position: absolute; top: 0.7rem; right: 0.75rem"
                @click="clearStructTree"
              />
            </div>
          </a-col>
          <a-col :md="16">
            <s-table
              ref="table"
              size="small"
              rowKey="id"
              :columns="columns"
              :data="loadData"
              :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
              :scroll="{ x: '120%', y: 400 }"
              :rowClassName="rowClassNameRender"
            ></s-table>
          </a-col>
        </a-row>
      </a-card>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from "moment";
import { STable } from "@/components";
import { pageGroup } from "@/api/system/user";
import { treeStruct } from "@/api/system/struct";
import _ from "lodash";
export default {
  name: "TableList",
  components: {
    STable,
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      title: "用户选择",
      groupId: "",
      advanced: false,
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      confirmLoading: false,
      queryParam: {
        dto: {
          groupId: this.groupId,
        },
      },
      // 表头
      columns: [
        {
          title: "真实姓名",
          dataIndex: "realName",
        },
        {
          title: "用户账号",
          dataIndex: "loginName",
        },
        {
          title: "移动电话",
          dataIndex: "mobile",
        },
        {
          title: "用户性别",
          dataIndex: "sex",
          align: "center",
          customRender: (text) => {
            return text === 1 ? "男" : "女";
          },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return pageGroup(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
      structTreeData: [],
    };
  },
  created() {
    this.treeStruct();
  },
  methods: {
    open() {
      this.visible = true;
    },
    refreshTable() {
      this.$refs.table.refresh();
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    treeStruct() {
      treeStruct().then((response) => {
        const treeDataArr = [];
        if (response.res) {
          treeDataArr.push(response.res);
        }
        this.structTreeData = treeDataArr;
      });
    },
    treeSelectEvent(selectedKeys, e) {
      if (e.node.dataRef.attributes && e.node.dataRef.id == "0") {
        this.queryParam.dto.structId = e.node.dataRef.attributes.topParentId;
      } else {
        this.queryParam.dto.structId = e.node.dataRef.id;
      }
      this.refreshTable();
    },
    clearStructTree() {
      this.queryParam.dto.structId = null;
      this.refreshTable();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    handleSubmit() {
      if (this.selectedRows.length === 0) {
        this.$message.error("没有选择任何用户!");
        return;  
      }
      this.$emit("ok", {
        groupId: this.groupId,
        userIds: _.map(this.selectedRows, "id"),
      });
      this.handleCancel();
    },
    handleCancel() {
      this.visible = false;
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.groupId = "";
    },
    rowClassNameRender(record, index) {
      if (record && record.groupId) {
        return "active";
      }
    },
  },
};
</script>
