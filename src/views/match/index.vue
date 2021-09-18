<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="标题">
              <a-input v-model="queryParam.dto.title" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select
                v-model="queryParam.dto.status"
                placeholder="请选择"
                default-value="1"
              >
                <a-select-option value>全部</a-select-option>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">隐藏</a-select-option>
              </a-select>
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
        v-has="{ perm: 'ndpx:edit' }"
        icon="plus"
        @click="handleEdit(0, null)"
        >新增评选</a-button
      >
      <!-- <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} 批量操作</a-button>
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0" v-has="{perm:'activity:batch'}">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleOpera(-1)">
            <a-icon type="delete" />删除
          </a-menu-item>
          <a-menu-item key="2" @click="handleOpera(1)">
            <a-icon type="lock" />隐藏
          </a-menu-item>
          <a-menu-item key="3" @click="handleOpera(0)">
            <a-icon type="unlock" />解除隐藏
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown> -->
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
      <span slot="images" slot-scope="text, record">
        <template>
          <img
            :src="record.imgurl"
            style="
              height: 30px;
              width: 60px;
              max-width: 100%;
              vertical-align: middle;
              border: 0;
            "
          />
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag
            color="teal"
            @click="handleItem(record.id)"
            v-has="{ perm: 'ndpx:edit' }"
            >候选者</a-tag
          >
          <a-tag
            color="orange"
            @click="handleEdit(1, record)"
            v-has="{ perm: 'ndpx:edit' }"
            >编辑</a-tag
          >
          <a-tag
            color="red"
            @click="handleDelete(record)"
            v-has="{ perm: 'ndpx:del' }"
            >删除</a-tag
          >
          <a-tag
            color="green"
            v-if="record.status == 1"
            @click="handleUpdate(record)"
            v-has="{ perm: 'ndpx:edit' }"
            >显示</a-tag
          >
          <a-tag
            color="hotpink"
            v-if="record.status == 0"
            @click="handleUpdate(record)"
            v-has="{ perm: 'ndpx:edit' }"
            >隐藏</a-tag
          >
          <a-tag
            color="hotpink"
            v-if="record.status == 0"
            @click="handleUpdate(record)"
            v-has="{ perm: 'ndpx:edit' }"
            >结果</a-tag
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
    <a-modal
      width="800px"
      v-if="userSearchVisible"
      title="候选者"
      :visible="userSearchVisible"
      :confirm-loading="userSearchLoading"
      @cancel="userSearchCancel"
      :footer="false"
    >
      <form-item ref="formItem" />
    </a-modal>
  </a-card>
</template>

<script>
import moment from "moment";
import formHandle from "./handle";
import formItem from "./item";
import { page, delByPk, batch, update } from "@/api/match";
import { STable } from "@/components";
export default {
  name: "TableList",
  components: {
    STable,
    formHandle,
    formItem,
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
        dto: {},
      },
      columns: [
        {
          title: "标题",
          dataIndex: "title",
        },
        {
          title: "图片",
          dataIndex: "images",
          width: "250px",
          scopedSlots: { customRender: "images" },
        },
        {
          title: "开始时间",
          dataIndex: "starttime",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD");
          },
        },
        {
          title: "结束时间",
          dataIndex: "endtime",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD");
          },
        },
        {
          title: "状态",
          dataIndex: "status",
          customRender: (text) => {
            return text === 1 ? "隐藏" : "正常";
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: "300px",
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
        title: "新建评选",
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
      userSearchVisible: false,
      userSearchLoading: false,
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
      this.drawer01.title = __type === 0 ? "新增评选" : "编辑评选";
      this.$nextTick(() => {
        if (__type === 1) this.$refs.formHandle.edit(record);
        else this.$refs.formHandle.add(this.queryParam.dto.typeid);
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
    userSearchCancel() {
      this.userSearchVisible = false;
    },
    handleUpdate(record) {
      const that = this;
      const msg = record.status == 1 ? "确定要显示吗？" : "确定要隐藏吗？";
      const status = record.status == 1 ? 0 : 1;
      this.$confirm({
        title: "操作提醒",
        content: msg,
        onOk() {
          update({ id: record.id, status: status })
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
    handleItem(id) {
      this.userSearchVisible = true;
      this.$nextTick(() => {
        this.$refs.formItem.queryParam.dto.matchid = id;
      });
    },
  },
  watch: {
    $route(cur, old) {
      this.$nextTick(() => {});
    },
  },
};
</script>
