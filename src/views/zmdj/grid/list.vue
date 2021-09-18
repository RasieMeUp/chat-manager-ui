<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="网格名称">
              <a-input v-model="queryParam.dto.title" placeholder="" />
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
    <div class="table-operator">
      <a-button
        type="primary"
        v-has="{ perm: 'word:add' }"
        icon="plus"
        @click="handleEdit(0, null)"
        >新增网格</a-button
      >
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag
            color="green"
            @click="handleEdit(1, record)"
            v-has="{ perm: 'word:edit' }"
            >编辑</a-tag
          >
          <a-tag
            color="red"
            @click="handleDelete(record)"
            v-has="{ perm: 'word:delete' }"
            >删除</a-tag
          >
        </template>
      </span>
    </s-table>
    <!-- <form-handle ref="formHandle" @ok="handleOk"  v-on:searchForm="searchForm"/> -->
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
      <form-handle ref="formHandle" @ok="handleOk"  v-on:searchForm="searchForm"/>
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
              $refs.formHandle.handleSubmit();
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
import formHandle from "./handle";
import { page, delByPk, batch } from "@/api/grid";
import { STable } from "@/components";
export default {
  name: "TableList",
  components: {
    STable,
    formHandle,
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
      advanced: false,
      optionAlertShow: true,
      queryParam: {
        dto: {
          categoryid: 0,
        },
      },
      columns: [
        {
          title: "网格名称",
          dataIndex: "title",
        },
        {
          title: "网格长",
          dataIndex: "adminName",
        },
        {
          title: "更新时间",
          dataIndex: "gmtModified",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD");
          },
        },
        {
          title: "备注",
          dataIndex: "remarks",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "250px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loadData: (parameter) => {
        return page(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
      drawer01: {
        visible: false,
        width: "400",
        placement: "right",
        title: "新增网格",
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = [];
          },
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
        },
      },
    };
  },
  created() {
    this.tableOption();
  },
  methods: {
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = [];
            },
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
          },
        };
        this.optionAlertShow = true;
      } else {
        this.options = {
          alert: false,
          rowSelection: null,
        };
        this.optionAlertShow = false;
      }
    },
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要删除吗?",
        onOk() {
          delByPk({ pk: record.id })
            .then((response) => {
              that.$message.info(response.message);
              that.$refs.table.refresh();
            })
            .catch((response) => {
              that.$message.warn(response.message);
            });
        },
        onCancel() {},
      });
    },
    handleEdit(__type, record) {
      this.drawer01.visible = true;
      this.drawer01.title = __type === 0 ? "新增网格" : "编辑网格";
      this.$nextTick(() => {
        if (__type === 1) this.$refs.formHandle.edit(record);
        else this.$refs.formHandle.add(this.queryParam.dto.categoryid);
      });
    },
    handleOk() {
      this.$refs.table.refresh();
      this.drawer01.visible = false;
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
      this.handleOk();
    },

    handleOpera(type) {
      const that = this;
      that.$confirm({
        title: "操作提醒",
        content: "确定要操作" + that.selectedRowKeys.length + "条数据吗?",
        onOk() {
          batch({ status: type, ids: that.selectedRowKeys })
            .then((reponse) => {
              that.$message.info(reponse.msg);
              that.$refs.table.refresh();
              that.options.rowSelection.selectedRowKeys = [];
            })
            .catch(() => console.log("Oops errors!"));
        },
        onCancel() {},
      });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
  },
  watch: {},
};
</script>
