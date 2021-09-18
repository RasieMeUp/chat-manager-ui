<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="内容">
              <a-input v-model="queryParam.dto.comment" placeholder="" />
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
                <a-select-option value="false">隐藏</a-select-option>
                <a-select-option value="true">显示</a-select-option>
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
            color="orange"
            @click="handleEdit(record)"
            v-has="{ perm: 'comments:update' }"
            >修改</a-tag
          >
          <a-tag
            color="green"
            v-if="record.status == false"
            @click="handleUpdate(record)"
            v-has="{ perm: 'comments:status' }"
            >显示</a-tag
          >
          <a-tag
            color="red"
            v-if="record.status == true"
            @click="handleUpdate(record)"
            v-has="{ perm: 'comments:status' }"
            >隐藏</a-tag
          >
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
import formHandle from "./handle";
import moment from "moment";
import { page, delByPk, update } from "@/api/usercomment";
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
        dto: {},
      },
      columns: [
        {
          title: "评论内容",
          dataIndex: "comment",
        },
        {
          title: "文章标题",
          dataIndex: "title",
          customRender: (text, res) => {
            return res.ptitle || res.ntitle;
          },
        },
        {
          title: "审核状态",
          dataIndex: "status",
          customRender: (text) => {
            return text === true ? "已审核" : "未审核";
          },
        },
        {
          title: "评论时间",
          dataIndex: "gmtCreate",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD");
          },
        },
        {
          title: "评论人",
          dataIndex: "realName",
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
      drawer01: {
        visible: false,
        width: "400",
        placement: "right",
        title: "编辑评论",
      },
    };
  },
  created() {
    this.tableOption();
    // this.setStartValue();
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
    handleEdit(record) {
      this.drawer01.visible = true;
      this.drawer01.title = "修改评论";
      this.$nextTick(() => {
        this.$refs.formHandle.edit(record);
      });
    },
    handleUpdate(record) {
      const that = this;
      const msg = record.status == false ? "确定要显示吗？" : "确定要隐藏吗？";
      const status = !record.status;
      this.$confirm({
        title: "操作提醒",
        content: msg,
        onOk() {
          update({
            id: record.id,
            fkId: record.fkId,
            status: status,
            ptitle: record.ptitle,
            ntitle: record.ntitle,
            createId:record.createId
          })
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
    handleOk() {
      this.$refs.table.refresh();
      this.drawer01.visible = false;
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    setStartValue(){
      var myDate = new Date();
      var yesterDaytime=(new Date).getTime()-24*60*60*1000;
      this.queryParam.startTime =moment(myDate).format("YYYY-MM-DD")+' 00:00:00';
      this.queryParam.endTime =moment(myDate).format("YYYY-MM-DD")+' 23:59:59';
      this.rangeValue = [ moment(myDate).format("YYYY-MM-DD"), moment(myDate).format("YYYY-MM-DD")];
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
      this.setStartValue();
      this.handleOk();
    },
  },
  watch: {
    $route(cur, old) {
      this.$nextTick(() => {});
    },
  },
};
</script>
