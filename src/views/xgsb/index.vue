<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="内容">
              <a-input v-model="queryParam.dto.contents" placeholder />
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
                <a-select-option value="0">未回复</a-select-option>
                <a-select-option value="1">已回复</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-select
                v-model="queryParam.dto.categoryId"
                placeholder="请选择"
                default-value="1"
              >
                <a-select-option value="99">全部</a-select-option>
                <a-select-option v-for="i in types" :key="i.value">{{
                  i.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- <div class="table-operator">
      <a-button
        type="primary"
        v-has="{perm:'news:add'}"
        icon="plus"
        @click="handleEdit(0,null)"
      >新增随手拍</a-button>
     
    </div>-->

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :scroll="{ x: 1000 }"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag
            color="green"
            @click="handleEdit(1, record)"
            v-has="{ perm: 'xgsb:show' }"
            >查看</a-tag
          >
          <a-tag
            color="orange"
            @click="handleReply(1, record)"
            v-has="{ perm: 'xgsb:reply' }"
            v-if="record.status == 0 && !record.reportStatus"
            >回复</a-tag
          >
          <a-tag
            color="purple"
            @click="handleReport(record)"
            v-if="record.status == 0 && !record.reportStatus"
            v-has="{ perm: 'report:superior' }"
            >上报</a-tag
          >
          <a-tag color="red" @click="handleDelete(record)" v-has="{ perm: 'xgsb:del' }"
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

    <a-drawer
      :title="drawer02.title"
      :width="drawer02.width"
      :maskClosable="false"
      :visible="drawer02.visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="
        () => {
          drawer02.visible = false;
        }
      "
    >
      <form-reply ref="formReply" @ok="handleOk2" />
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
              drawer02.visible = false;
            }
          "
          >取消</a-button
        >
        <a-button
          type="primary"
          @click="
            () => {
              $refs.formReply.handleSubmit();
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
import { page, delByPk, batch, report } from "@/api/photographs";
import { STable } from "@/components";
import { menunames } from "@/config/xgsbmenuconfig";
import formReply from "./reply";
import { selectType } from "@/api/system/dict";
export default {
  name: "TableList",
  components: {
    STable,
    formHandle,
    formReply,
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
          categoryId: "99",
        },
      },
      columns: [
        {
          title: "上报内容",
          dataIndex: "contents",
          width: "300px",
          ellipsis:true,
        },
        {
          title: "上报类型",
          width: "100px",
          dataIndex: "categoryName",
        },
        {
          title: "上报时间",
          width: "150px",
          dataIndex: "gmtCreate",
          align: "center",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD HH:mm:ss");
          },
        },
        {
          title: "回复状态",
          width: "100px",
          dataIndex: "status",
          align: "center",
          customRender: (text) => {
            return text === 1 ? "已回复" : "未回复";
          },
        },
        // {
        //   title: "上报状态",
        //   width: "100px",
        //   dataIndex: "reportStatus",
        //   align: "center",
        //   customRender: (text) => {
        //     return text ? "已上报" : "未上报";
        //   },
        // },
        {
          title: "上报人",
          width: "100px",
          dataIndex: "realName",
        },
        {
          title: "代办人",
          width: "100px",
          dataIndex: "comsinUname",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "220px",
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
      loadData: (parameter) => {
        return page(Object.assign(parameter, this.queryParam)).then((response) => {
          return response.res;
        });
      },
      drawer01: {
        visible: false,
        width: "400",
        placement: "right",
        title: "查看内容",
      },
      drawer02: {
        visible: false,
        width: "400",
        placement: "right",
        title: "回复",
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
      types: [],
    };
  },
  created() {
    this.tableOption();
    this.getTypeId(this.$route.name);
    this.getTypes("FBXQLX");
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
      this.drawer01.title = "查看内容";
      this.$nextTick(() => {
        this.$refs.formHandle.edit(record);
      });
    },
    handleReply(__type, record) {
      this.drawer02.visible = true;
      this.drawer02.title = "回复";
      this.$nextTick(() => {
        this.$refs.formReply.reply(record);
      });
    },
    handleOk() {
      this.$refs.table.refresh();
      this.drawer01.visible = false;
    },
    handleOk2() {
      this.$refs.table.refresh();
      this.drawer02.visible = false;
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
      this.getTypeId(this.$route.name);
      this.handleOk();
    },
    getTypeId(name) {
      var temp = menunames.find((item) => item.name === name);
      if (temp) {
        this.queryParam.dto.categoryId = temp.value;
      }
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
    getTypes(__type) {
      selectType({ type: __type }).then((response) => {
        this.types = response.res;
      });
    },
    //不能处理 上报上级处理
    handleReport(__record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要上报此条信息吗?",
        onOk() {
          report({ id: __record.id })
            .then((response) => {
              that.$message.info(response.message);
              that.$refs.table.refresh();
            })
            .catch((response) => {
              that.$message.warn("上报失败");
            });
        },
        onCancel() {},
      });
    },
  },
  watch: {
    $route(cur, old) {
      this.$nextTick(() => {
        this.getTypeId(cur.name);
        this.$refs.table.refresh(true);
      });
    },
  },
};
</script>

