<style>
.active {
  background: #1890ff;
}
</style>
<template>
  <a-modal
    :title="title"
    :width="900"
    :height="550"
    :maskClosable="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="24" type="flex" justify="center">
        <a-col :md="11">
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
              未绑定
            </template>
            <span slot="actived" slot-scope="text, record">
              <template>
                <a-tag v-if="record.actived" color="green">是</a-tag>
                <a-tag v-else color="red">否</a-tag>
              </template>
            </span>
            <span slot="party" slot-scope="text, record">
              <template>
                <a-tag v-if="record.party" color="green">是</a-tag>
                <a-tag v-else color="red">否</a-tag>
              </template>
            </span>
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
        <a-col :md="11">
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
              已绑定
            </template>
            <span slot="actived" slot-scope="text, record">
              <template>
                <a-tag v-if="record.actived" color="green">是</a-tag>
                <a-tag v-else color="red">否</a-tag>
              </template>
            </span>
            <span slot="party" slot-scope="text, record">
              <template>
                <a-tag v-if="record.party" color="green">是</a-tag>
                <a-tag v-else color="red">否</a-tag>
              </template>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from "moment";
import { STable } from "@/components";
import { noBindpage, bindpage } from "@/api/system/user";
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
  },
  data() {
    return {
      title: "用户选择",
      groupId: "",
      advanced: false,
      unbind: {
        selectedRowKeys: [],
      },
      bind: {
        selectedRowKeys: [],
      },
      visible: false,
      confirmLoading: false,
      queryParam: {
        dto: {
          foreignId: "",
          realName: "",
        },
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
        {
          title: "是否激活",
          dataIndex: "actived",
          align: "center",
          scopedSlots: { customRender: "actived" },
        },
        {
          title: "是否党员",
          dataIndex: "party",
          align: "center",
          scopedSlots: { customRender: "party" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadUnBindData: (parameter) => {
        return noBindpage(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
      // 加载数据方法 必须为 Promise 对象
      loadBindData: (parameter) => {
        return bindpage(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
    };
  },
  created() {},
  methods: {
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
    },
    onSelectUnBindChange(selectedRowKeys, selectedRows) {
      this.unbind.selectedRowKeys = selectedRowKeys;
    },
    handleCancel() {
      this.visible = false;
      this.unbind.selectedRowKeys = [];
      this.bind.selectedRowKeys = [];
      this.queryParam.dto.foreignId = "";
    },
    handleBindOrUnbind(__type) {
      if (__type) {
        if (this.unbind.selectedRowKeys.length === 0) {
          this.$message.error("没有选择任何村民");
          return;
        }
        this.$emit("bind", {
          foreignId: this.queryParam.dto.foreignId,
          userIds: this.unbind.selectedRowKeys,
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