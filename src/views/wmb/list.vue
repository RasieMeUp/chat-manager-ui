<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="村民名称">
              <a-input v-model="queryParam.dto.userName" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="
                (advanced && { float: 'right', overflow: 'hidden' }) || {}
              "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)"
                >查询</a-button
              >
              <a-button style="margin-left: 8px" @click="resetSearchForm()"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="handleDetail(record)">文明币记录</a-tag>
          <a-tag
            color="green"
            @click="handleAddOrEdit(record)"
            v-has="{ perm: 'integral:operate' }"
            >文明币操作</a-tag
          >
        </template>
      </span>
    </s-table>
    <a-modal
      width="800px"
      v-if="modalVisible"
      title="文明币记录"
      :visible="modalVisible"
      :confirm-loading="modalLoding"
      @cancel="handleModalCancel"
      @ok="handleModalOK"
    >
      <form-list ref="listItem" />
    </a-modal>
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
      <handle ref="formConfig" @ok="handleOk" />
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
              $refs.formConfig.handleCancel();
            }
          "
          >取消</a-button
        >
        <a-button
          type="primary"
          v-has="{ perm: 'integral:config:save' }"
          @click="
            () => {
              $refs.formConfig.handleSubmit();
            }
          "
          >确定</a-button
        >
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
import moment from "moment";
import { userPage } from "@/api/system/integral";
import { STable } from "@/components";
import formList from "./formList";
import handle from "./handle";
export default {
  name: "TableList",
  components: {
    STable,
    formList,
    handle,
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        dto: {},
      },
      // 表头
      columns: [
        {
          title: "村民名称",
          dataIndex: "realName",
        },
        {
          title: "获得文明币",
          dataIndex: "integral",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return userPage(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
      optionAlertShow: false,
      modalLoding: false,
      modalVisible: false,
      drawer01: {
        visible: false,
        width: "400",
        placement: "right",
        title: "编辑配置",
      },
    };
  },
  created() {},
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
    },
    handleDetail(__record) {
      if (__record && __record.id) {
        this.modalVisible = true;
        this.$nextTick(() => {
          this.$refs.listItem.queryParam.dto.userId = __record.id;
        });
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
    },
    handleModalOK() {
      this.modalVisible = false;
    },
    handleAddOrEdit(record) {
      this.drawer01.visible = true;
      this.drawer01.title = "文明币操作";
      this.$nextTick(() => {
        this.$refs.formConfig.edit(record);
      });
    },
    handleOk() {
      this.$refs.table.refresh();
      this.drawer01.visible = false;
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
  },
};
</script>
