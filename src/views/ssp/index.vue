<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="内容">
              <a-input v-model="queryParam.dto.content" placeholder="" />
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
        v-has="{ perm: 'news:add' }"
        icon="plus"
        @click="handleEdit(0, null)"
        >新增随手拍</a-button
      >
      <a-button type="dashed" @click="tableOption"
        >{{ (optionAlertShow && "关闭") || "开启" }} 批量操作</a-button
      >
      <a-dropdown
        v-action:edit
        v-if="selectedRowKeys.length > 0"
        v-has="{ perm: 'news:batch' }"
      >
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
      </a-dropdown>
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
          <a @click="handleEdit(1, record)" v-has="{ perm: 'news:edit' }"
            >编辑</a
          >
          <a-divider type="vertical" v-has="{ perm: 'news:edit' }" />
          <a @click="handleDelete(record)" v-has="{ perm: 'news:delete' }"
            >删除</a
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
import { page, delByPk, batch } from "@/api/photographs";
import { STable } from "@/components";
import { menunames } from "@/config/newsmenuconfig";
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
          categoryId: 0,
        },
      },
      columns: [
        {
          title: "内容",
          dataIndex: "contents",
        },
        // {
        //   title: '主图',
        //   dataIndex: 'imgurls',
        //   customRender: (text) => {
        //     if (text){
        //       var imgs = text.split(',')
        //       if (imgs.length>0){
        //         return '<image src="'+imgs[0]+'">'
        //       }
        //     }
        //   }
        // },
        {
          title: "点击数",
          dataIndex: "clicknum",
          width: "100px",
        },
        {
          title: "评论数",
          dataIndex: "commentnum",
          width: "100px",
        },
        {
          title: "拍摄时间",
          dataIndex: "gmtCreate",
          width:"150px",
          align:"center",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD HH:mm:ss");
          },
        },
        {
          title: "拍摄人",
          dataIndex: "realName",
          width: "100px",
        },
        {
          title: "是否回复",
          dataIndex: "status",
          width: "100px",
          customRender: (text) => {
            return text === 1 ? "隐藏" : "正常";
          },
        },
        {
          title: "审核状态",
          dataIndex: "verify",
          width: "100px",
          customRender: (text) => {
            return text ? "已审核" : "未审核";
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "120px",
          align:"center",
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
        title: "新建随手拍",
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
    // this.getTypeId(this.$route.name)
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
          delByPk({ id: record.id })
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
      this.drawer01.title = __type === 0 ? "新增随手拍" : "编辑随手拍";
      this.$nextTick(() => {
        if (__type === 1) this.$refs.formHandle.edit(record);
        else this.$refs.formHandle.add(this.queryParam.dto.categoryid);
      });
    },
    handleOk() {
      this.$refs.table.refresh();
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
      // this.getTypeId(this.$route.name)
      this.handleOk();
    },
    getTypeId(name) {
      var temp = menunames.find((item) => item.name === name);
      if (temp) {
        //this.queryParam.dto.categoryid = temp.value
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
  },
  watch: {
    $route(cur, old) {
      this.$nextTick(() => {
        // this.getTypeId(cur.name)
        this.$refs.table.refresh(true);
      });
    },
  },
};
</script>
