<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-select
                placeholder="请选择类型"
                v-model="queryParam.dto.type"
                :allowClear="true"
                @change="loadData"
              >
                <a-select-option
                  v-for="(obj, index) in types"
                  :key="index"
                  :value="obj.type"
                >{{ obj.type }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-has="{perm:'dict:save'}"
        @click="$refs.formHandle.add()"
      >新建数据字典</a-button>
    </div>
    <a-table :columns="columns" :dataSource="data">
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="orange" @click="handleEdit(record)" v-has="{perm:'dict:update'}">编辑</a-tag>
          <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'dict:delete'}">删除</a-tag>
          <a-tag
            color="green"
            @click="handleAddChild(record)"
            v-has="{perm:'dict:save'}"
            v-show="!queryParam.dto.type"
          >添加子项</a-tag>
        </template>
      </span>
    </a-table>
    <form-handle ref="formHandle" @ok="handleOk"  v-on:searchForm="searchForm"/>
  </a-card>
</template>

<script>
import formHandle from "./handle";
import { page, delByPk, listType } from "@/api/system/dict";
import moment from "moment";
export default {
  name: "TableList",
  components: {
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
      types: [],
      queryParam: {
        dto: {},
      },
      columns: [
        {
          title: "字典名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "字典值",
          dataIndex: "attributes.dictCode",
          key: "id",
          width: "16%",
        },
        {
          title: "类型",
          dataIndex: "attributes.dictType",
        },
        {
          title: "描述",
          dataIndex: "attributes.dictDesc",
        },
        {
          title: "排序",
          dataIndex: "attributes.orderNum",
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
      ],
      data: [],
    };
  },
  created() {
    this.listType();
    this.loadData();
  },
  methods: {
    loadData() {
      return page({ type: this.queryParam.dto.type }).then((response) => {
        this.data = response.res.children;
      });
    },
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要删除吗?",
        onOk() {
          delByPk({ pk: record.id })
            .then((response) => {
              if (response.code === 0) {
                that.$message.info("操作成功!");
              } else {
                that.$message.error(response.message);
              }
              that.handleOk();
            })
            .catch((response) => {
              that.$message.warn(response.message);
            });
        },
        onCancel() {},
      });
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record);
    },
    handleAddChild(record) {
      this.$refs.formHandle.addChild(record);
    },
    handleOk() {
      this.listType();
      this.loadData();
    },
    listType() {
      listType({}).then((response) => {
        this.types = response.res;
      });
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
      this.handleOk();
    },
  },
};
</script>
