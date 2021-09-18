<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag
            color="orange"
            @click="handleAddOrEdit(record)"
            v-has="{ perm: 'integral:config:update' }"
            >编辑</a-tag
          >
        </template>
      </span>
      <span slot="status" slot-scope="text, record">
        <template>
          <a-tag v-if="record.status" color="green">可用</a-tag>
          <a-tag v-else color="red">不可用</a-tag>
        </template>
      </span>
    </s-table>
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
      <form-config ref="formConfig" @ok="handleOk" />
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
import formConfig from "./form";
import { page } from "@/api/system/integral";
import { STable } from "@/components";
export default {
  name: "TableList",
  components: {
    STable,
    formConfig,
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
          title: "名称",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "分值",
          dataIndex: "integral",
          align: "center",
        },
        {
          title: "当日最多",
          dataIndex: "dayMax",
          align: "center",
        },
        {
          title: "可用状态",
          dataIndex: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
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
        return page(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
      optionAlertShow: false,
      drawer01: {
        visible: false,
        width: "400",
        placement: "right",
        title: "编辑配置",
      },
    };
  },
  created() {
  },
  methods: {
    handleAddOrEdit(record) {
      this.drawer01.visible = true;
      this.drawer01.title = "编辑配置";
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
