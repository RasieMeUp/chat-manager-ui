<style>
.active {
  background: #1890ff;
}
</style>
<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="550"
    :maskClosable="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="24" type="flex" justify="center">
        <a-col :md="4">
          <div style="border: 1px dashed #e8e8e8; position: relative">
            <a-tree
              @select="handleStructSelect"
              :treeData="treeData"
              :show-line="true"
              ref="handleStructInit"
            />
            <a-icon
              type="sync"
              style="position: absolute; top: 0.7rem; right: 0.75rem"
              @click="clearStructTree"
            />
          </div>
        </a-col>
        <a-col :md="9">
          <s-table
            ref="unbind"
            size="small"
            rowKey="id"
            :columns="columns"
            :data="loadUnBindData"
            :rowSelection="{
              selectedRowKeys: unbind.selectedRowKeys,
              onChange: onSelectUnBindChange,
            }"
          >
            <template slot="title" slot-scope="currentPageData">
              未选择
            </template>
            <div
              slot="filterDropdown"
              slot-scope="{
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
                column,
              }"
              style="padding: 8px"
            >
              <a-input
                v-ant-ref="(c) => (searchInput = c)"
                :placeholder="`真实姓名筛选`"
                :value="selectedKeys[0]"
                style="width: 188px; margin-bottom: 8px; display: block"
                @change="
                  (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
                "
                @pressEnter="
                  () =>
                    handleBindTableSearch(
                      selectedKeys,
                      confirm,
                      column.dataIndex
                    )
                "
              />
              <a-button
                type="primary"
                icon="search"
                size="small"
                style="width: 90px; margin-right: 8px"
                @click="
                  () =>
                    handleBindTableSearch(
                      selectedKeys,
                      confirm,
                      column.dataIndex
                    )
                "
              >
                筛选
              </a-button>
              <a-button
                size="small"
                style="width: 90px"
                @click="() => handleBindTableReset(clearFilters)"
              >
                重置
              </a-button>
            </div>
            <a-icon
              slot="filterIcon"
              slot-scope="filtered"
              type="search"
              :style="{ color: filtered ? '#108ee9' : undefined }"
            />
            <template
              slot="customRender"
              slot-scope="text, record, index, column"
            >
              <span v-if="queryParam.dto.realName">
                <template
                  v-for="(fragment, i) in text
                    .toString()
                    .split(
                      new RegExp(
                        `(?<=${queryParam.dto.realName})|(?=${queryParam.dto.realName})`,
                        'i'
                      )
                    )"
                >
                  <mark
                    v-if="
                      fragment.toLowerCase() ===
                      queryParam.dto.realName.toLowerCase()
                    "
                    :key="i"
                    class="highlight"
                    >{{ fragment }}</mark
                  >
                  <template v-else>{{ fragment }}</template>
                </template>
              </span>
              <template v-else>
                {{ text }}
              </template>
            </template>
          </s-table>
        </a-col>
        <a-col :md="2" style="align-self: center">
          <a-button
            type="primary"
            class="table-but"
            @click="handleBindOrUnbind(true)"
            v-has="{ perm: 'user:struct:bind' }"
            >→</a-button
          >
          <a-button
            type="danger"
            class="table-but"
            style="margin-top: 20px"
            @click="handleBindOrUnbind(false)"
            v-has="{ perm: 'user:struct:bind' }"
            >←</a-button
          >
        </a-col>
        <a-col :md="9">
          <s-table
            ref="bind"
            size="small"
            rowKey="id"
            :columns="columns"
            :data="loadBindData"
            :rowSelection="{
              selectedRowKeys: bind.selectedRowKeys,
              onChange: onSelectBindChange,
            }"
          >
            <template slot="title" slot-scope="currentPageData">
              已选择
            </template>
          </s-table>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from "@/components";
import { noBindActivitypage, bindActivitypage } from "@/api/system/user";
import { treeStruct } from "@/api/system/struct";
import _ from "lodash";
export default {
  name: "bindUser",
  components: {
    STable,
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
    loadFirst: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: "用户选择",
      groupId: "",
      advanced: false,
      unbind: {
        selectedRowKeys: [],
        selectedRows: [],
        total: 0,
        data: [],
      },
      bind: {
        selectedRowKeys: [],
        selectedRows: [],
        total: 0,
        data: [],
      },
      visible: false,
      confirmLoading: false,
      queryParam: {
        dto: {
          foreignId: "",
          realName: "",
        },
        pageNo: 1,
        pageSize: 10,
      },
      // 表头
      columns: [
        {
          title: "真实姓名",
          dataIndex: "realName",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.realName
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadUnBindData: async (parameter) => {
        const response=await noBindActivitypage(
          Object.assign(parameter, this.queryParam)
        );
        return response.res;
      },
      // 加载数据方法 必须为 Promise 对象
      loadBindData: async (parameter) => {
        const response=await bindActivitypage(Object.assign(parameter, this.queryParam));
        return response.res;
      },
      treeData: [],
    };
  },
  created() {
    this.handleStructInit();
  },
  methods: {
    handleStructInit() {
      treeStruct().then((response) => {
        const treeDataArr = [];
        if (response.res) {
          treeDataArr.push(response.res);
        }
        this.treeData = treeDataArr;
      });
    },
    handleStructSelect(selectedKeys, e) {
      if (e.node.dataRef.attributes && e.node.dataRef.id == "0") {
        this.queryParam.dto.structId = e.node.dataRef.attributes.topParentId;
      } else {
        this.queryParam.dto.structId = e.node.dataRef.id;
      }
      this.$refs.unbind.refresh();
    },
    clearStructTree() {
      this.queryParam.dto.structId = "";
      this.$refs.unbind.refresh();
    },
    open() {
      this.visible = true;
    },
    handleBindTableSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.queryParam.dto.realName = selectedKeys[0];
      this.$refs.unbind.refresh();
    },
    handleBindTableReset(clearFilters) {
      clearFilters();
      this.queryParam.dto.realName = "";
      this.$refs.unbind.refresh();
    },
    refreshTable() {
      this.$refs.unbind.refresh();
      this.$refs.bind.refresh();
      this.unbind.selectedRowKeys = [];
      this.bind.selectedRowKeys = [];
    },
    onSelectBindChange(selectedRowKeys, selectedRows) {
      this.bind.selectedRowKeys = selectedRowKeys;
      this.bind.selectedRows = selectedRows;
    },
    onSelectUnBindChange(selectedRowKeys, selectedRows) {
      this.unbind.selectedRowKeys = selectedRowKeys;
      this.unbind.selectedRows = selectedRows;
    },
    handleCancel() {
      this.visible = false;
      this.unbind.selectedRowKeys = [];
      this.bind.selectedRowKeys = [];
      this.bind.selectedRows = [];
      this.unbind.selectedRows = [];
      this.queryParam.dto.foreignId = "";
      this.queryParam.dto.structId = "";
    },
    handleBindOrUnbind(__type) {
      let that = this;
      if (__type) {
        if (
          this.unbind.selectedRowKeys.length === 0 &&
          !this.queryParam.dto.structId
        ) {
          this.$message.error("没有选择任何村民");
          return;
        }
        if (that.queryParam.dto.structId) {
          that.$confirm({
            content: "确定按照机构筛选添加村民?",
            onOk() {
              that.$emit("bind", {
                foreignId: that.queryParam.dto.foreignId,
                userIds: that.unbind.selectedRowKeys,
                structId: that.queryParam.dto.structId,
                realNames: _.map(that.unbind.selectedRows, "realName"),
                bind: true,
              });
            },
          });
          return;
        }
        this.$emit("bind", {
          foreignId: this.queryParam.dto.foreignId,
          userIds: this.unbind.selectedRowKeys,
          structId: this.queryParam.dto.structId,
          realNames: _.map(this.unbind.selectedRows, "realName"),
          bind: true,
        });
      } else {
        if (this.bind.selectedRowKeys.length === 0) {
          this.$message.error("没有选择任何村民");
          return;
        }
        this.$emit("bind", {
          foreignId: this.queryParam.dto.foreignId,
          userIds: this.bind.selectedRowKeys,
          bind: false,
        });
      }
    },
  },
};
</script>