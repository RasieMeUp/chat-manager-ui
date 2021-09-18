<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="词语内容">
              <a-input v-model="queryParam.commentId" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="18" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="searchForm()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()"
                >重置</a-button
              >
              <a-button type="primary" style="margin-left: 8px" @click="handleOpera(-1)"
                >批量删除</a-button
              >
              <a-button type="primary" style="margin-left: 8px" @click="handleOpera(1)"
                >批量新增</a-button
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

      <span slot="commentId" slot-scope="commentId">
        <template>
          {{ commentId | isEmpty(true) }}
        </template>
      </span>
      <span slot="digitId" slot-scope="digitId">
        <template>
          {{ digitId | isEmpty(true) }}
        </template>
      </span>
      

      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="red" @click="handleDelete(record)" v-has="{ perm: 'news:delete' }"
            >删除</a-tag
          >
        </template>
      </span>
    </s-table>

    <a-modal
      :title="shModalT"
      :visible="shModal"
      :confirm-loading="false"
      ok-text="审核通过"
      cancel-text="审核不通过"
      :footer="null"
      @cancel="shHandleCancel"
      width="400px"
    >
      <div style="text-align: center; padding: 0px 0 0 0">
        <a-button
          type="primary"
          size="large"
          @click="shHandleOk(1)"
          style="margin-right: 50px"
        >
          审核通过
        </a-button>
        <a-button type="danger" size="large" @click="shHandleOk(0)">
          审核不通过
        </a-button>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import moment from "moment";
import { page, delByPk, batch } from "@/api/news";
import { getAnchor } from "@/api/system/userManager";
import { latestList } from "@/api/system/dynamic";
import { STable } from "@/components";
export default {
  name: "ckList",
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
      shModal: false,
      shModalT: "",
      advanced: false,
      optionAlertShow: false,
      queryParam: {},
      columns: [
        {
          title: "词语ID",
          dataIndex: "commentId",
          scopedSlots: { customRender: "commentId" },
        },
        {
          title: "词语内容",
          dataIndex: "digitId",
          scopedSlots: { customRender: "digitId" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loadData: (parameter) => {
        return getAnchor(Object.assign(parameter, this.queryParam)).then((response) => {
          console.log("评论列表==>", response);
          // let res = {
          //   // hasNext: true,
          //   pageCount: response.extra.totalPage,
          //   pageIndex: response.extra.currPage,
          //   pageSize: 10,
          //   total: response.extra.totalEle,
          //   rows: [],
          //   userCount:response.extra.userCount,
          // };
          //  res.rows = response.data;
          this.userCount = response.extra.userCount;
          //临时数据
          let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
          res.rows = response.data;
          return res;
          return response.res;
        });
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
  filters: {
  isEmpty(__value,__type) {
      if(__value !== null && typeof __value !== 'undefined') return __value;
        if(__type){
          return '-';
        }else{
          return '0';
        }
      },
  },
  methods: {
    //选择开始时间/结束时间
    calendarPriceRangeChange(date){
      this.selectRangeValue = date[0];
    },
	//根据选择的开始时间/结束时间，动态渲染要禁用的日期
    disabledPriceRangeDate(current){
        if(this.selectRangeValue){
          var daytime=moment(this.selectRangeValue, 'YYYY-MM-DD').valueOf();
          var daytime2=moment(this.selectRangeValue, 'YYYY-MM-DD').valueOf() + 24*31*60*60*1000;
          return current > moment().endOf('day') || current < moment(daytime).startOf('day') || current > moment(daytime2).endOf('day')

        }else{
          return current > moment().endOf('day')
        }
    },
    rangeOnChange(date, dateString) {
      this.selectRangeValue = '';
      this.rangeValue = date;
      if(this.rangeValue.length==0){
          delete this.queryParam.startTime;
          delete this.queryParam.endTime;
        return;
      }else{
        this.queryParam.startTime =dateString[0] + " 00:00:00";
        this.queryParam.endTime = dateString[1] + " 23:59:59";  
      
      }
    },
    callback(key) {
      console.log(key);
    },
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
        content: "确定要隐藏吗?",
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
    handleOk() {
      this.$refs.table.refresh();
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    resetSearchForm() {
      this.queryParam = {};
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
    auditHandle(pageParam, title) {
      this.shModalT = title;
      this.shModal = true;
    },
    shHandleCancel() {
      this.shModal = false;
    },
    shHandleOk(__id) {
      anchorHandle({
        serialNumber: this.pageParam.serialNumber,
        operate: __id,
      })
        .then((response) => {
          if (response.success) that.$message.info("操作成功!");
          else that.$message.error(response.message);
        })
        .then(() => {
          this.shModal = false;
        });
    },
  },
  watch: {
    $route(cur, old) {
      this.$nextTick(() => {
        this.$refs.table.refresh(true);
      });
    },
  },
};
</script>
