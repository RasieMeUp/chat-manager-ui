<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户账户">
              <a-input v-model="queryParam.dto.loginName" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="用户状态">
              <a-select v-model="queryParam.dto.status" placeholder="请选择">
                <a-select-option value>全部</a-select-option>
                <a-select-option value="true">正常</a-select-option>
                <a-select-option value="false">锁定</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="真实姓名">
                <a-input
                  v-model="queryParam.dto.realName"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="身份证">
                <a-input v-model="queryParam.dto.idCard" style="width: 100%" />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
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
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? "收起" : "展开" }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button
        type="primary"
        v-has="{ perm: 'user:save' }"
        icon="plus"
        @click="handleAddOrEdit(0, null)"
        >新建用户</a-button
      >
      <a-button type="dashed" @click="tableOption"
        >{{ (optionAlertShow && "关闭") || "开启" }} 批量操作</a-button
      >
      <a-dropdown
        v-action:edit
        v-if="selectedRowKeys.length > 0"
        v-has="{ perm: 'user:batch' }"
      >
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleOpera(-1)">
            <a-icon type="delete" />删除
          </a-menu-item>
          <a-menu-item key="2" @click="handleOpera(1)">
            <a-icon type="lock" />锁定
          </a-menu-item>
          <a-menu-item key="3" @click="handleOpera(0)">
            <a-icon type="unlock" />解除锁定
          </a-menu-item>
          <a-menu-item key="4" @click="handleStruct">
            <a-icon type="unlock" />修改归属
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        style="margin-left: 8px"
        v-has="{ perm: 'user:export' }"
        type="danger"
        @click="handleExport"
      >
        导出
      </a-button>
    </div>

    <a-row :gutter="24">
      <a-col :md="3">
        <div style="border: 1px dashed #e8e8e8; position: relative">
          <a-tree
            @select="treeSelectEvent"
            :treeData="structTreeData"
            :show-line="true"
            ref="treeStruct"
          />
          <a-icon
            type="sync"
            style="position: absolute; top: 0.7rem; right: 0.75rem"
            @click="clearStructTree"
          />
        </div>
      </a-col>
      <a-col :md="21">
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
          :scroll="{ x: 1300 }"          
        >
          <span slot="serial" slot-scope="text, record, index">{{
            index + 1
          }}</span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a-tag
                color="orange"
                @click="handleAddOrEdit(1, record)"
                v-has="{ perm: 'user:update' }"
                >编辑</a-tag
              >
              <a-tag
                color="red"
                @click="handleDelete(record)"
                v-has="{ perm: 'user:delete' }"
                >删除</a-tag
              >
              <a-tag
                color="green"
                @click="resetPass(record)"
                v-has="{ perm: 'user:resetPass' }"
                >密码重置</a-tag
              >
            </template>
          </span>
          <span slot="status" slot-scope="text, record">
            <template>
              <a-tag v-if="record.status" color="green">可用</a-tag>
              <a-tag v-else color="red">锁定</a-tag>
            </template>
          </span>
          <span slot="actived" slot-scope="text, record">
            <template>
              <a-tag v-if="record.actived" color="green">已激活</a-tag>
              <a-tag v-else color="red">未激活</a-tag>
            </template>
          </span>
          <span slot="vmanager" slot-scope="text, record">
            <template>
              <a-tag v-if="record.vmanager" color="red">是</a-tag>
              <a-tag v-else color="blue">否</a-tag>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <pass-notify ref="passNotify"></pass-notify>
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
      <form-user ref="formUser" @ok="handleOk" />
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
              $refs.formUser.handleSubmit();
            }
          "
          >确定</a-button
        >
      </div>
    </a-drawer>
    <form-handle-struct ref="formHandleStruct" @ok="handleOk"  v-on:searchForm="searchForm"/>
  </a-card>
</template>

<script>
import moment from "moment";
import formUser from "./form";
import formHandleStruct from "./handleStruct";
import passNotify from "./passNotify";
import {
  page,
  delByPk,
  batch,
  resetPass,
  expuser,
  download,
} from "@/api/system/user";
import { treeStruct } from "@/api/system/struct";
import { STable } from "@/components";
export default {
  name: "TableList",
  components: {
    STable,
    passNotify,
    formUser,
    formHandleStruct,
  },
  props: {},
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        dto: {
          manager: 0,
        },
      },
      // 表头
      columns: [
        {
          title: "用户账号",
          dataIndex: "loginName",
          fixed: "left",
          width: "150px",
        },
        {
          title: "真实姓名",
          dataIndex: "realName",
        },
        {
          title: "区域归属",
          dataIndex: "orgName",
        },
        // {
        //   title: "机构归属",
        //   dataIndex: "structName",
        // },
        // {
        //   title: "固定电话",
        //   dataIndex: "fiexdtel",
        // },
        {
          title: "移动电话",
          dataIndex: "mobile",
        },
        // {
        //   title: "用户性别",
        //   dataIndex: "sex",
        //   align: "center",
        //   needTotal: false,
        //   customRender: (text) => {
        //     return text === 1 ? "男" : "女";
        //   },
        // },
        {
          title: "村管理员",
          dataIndex: "vmanager",
          align: "center",
          width: "80px",
          scopedSlots: { customRender: "vmanager" },
        },
        {
          title: "是否可用",
          dataIndex: "status",
          align: "center",
          width: "80px",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "是否激活",
          dataIndex: "actived",
          align: "center",
          width: "80px",
          scopedSlots: { customRender: "actived" },
        },
        {
          title: "创建时间",
          dataIndex: "gmtCreate",
          sorter: true,
          needTotal: false,
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD HH:mm:ss");
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: "200px",
          scopedSlots: { customRender: "action" },
          fixed: "right",
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log(parameter)
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
      optionAlertShow: true,
      drawer01: {
        visible: false,
        width: "800",
        placement: "right",
        title: "新建用户",
      },
      structTreeData: [],
    };
  },
  filters: {},
  created() {
    this.treeStruct();
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
          delByPk({ id: record.id })
            .then((res) => {
              if (res.code === 0) {
                that.$message.info("操作成功!");
              } else {
                that.$message.error(res.msg);
              }
              that.$refs.table.refresh();
            })
            .catch(() => console.log("Oops errors!"));
        },
        onCancel() {},
      });
    },
    handleOpera(type) {
      batch({ type: type, userIds: this.selectedRowKeys })
        .then((reponse) => {
          this.$message.info(reponse.msg);
          this.$refs.table.refresh();
          this.options.rowSelection.selectedRowKeys = [];
        })
        .catch(() => console.log("Oops errors!"));
    },
    handleAddOrEdit(__type, record) {
      this.drawer01.visible = true;
      this.drawer01.title = __type == 0 ? "新增用户" : "编辑用户";
      this.$nextTick(() => {
        if (__type == 1) this.$refs.formUser.edit(record);
        else this.$refs.formUser.add();
      });
    },
    handleOk() {
      this.$refs.table.refresh();
      this.drawer01.visible = false;
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    handleStructOK() {},
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetPass(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要重置密码吗?",
        onOk() {
          resetPass({ id: record.id })
            .then((res) => {
              if (res.code === 0) {
                that.$message.info("操作成功!");
                that.$refs.passNotify.open(res);
                that.$refs.table.refresh();
              } else {
                that.$message.error(res.msg);
              }
            })
            .catch(() => console.log("Oops errors!"));
        },
        onCancel() {},
      });
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
      this.handleOk();
    },
    treeStruct() {
      treeStruct().then((response) => {
        const treeDataArr = [];
        if (response.res) {
          treeDataArr.push(response.res);
        }
        this.structTreeData = treeDataArr;
      });
    },
    treeSelectEvent(selectedKeys, e) {
      if (e.node.dataRef.attributes && e.node.dataRef.id == "0") {
        this.queryParam.dto.structId = e.node.dataRef.attributes.topParentId;
      } else {
        this.queryParam.dto.structId = e.node.dataRef.id;
      }
      this.$refs.table.refresh();
    },
    clearStructTree() {
      this.queryParam.dto.structId = null;
      this.$refs.table.refresh();
    },
    handleExport() {
      expuser(this.queryParam).then((res) => {
        if (res) {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          let fileName = "村民数据.xls";
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          }
          // for Non-IE (chrome, firefox etc.)
          else {
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = URL.createObjectURL(blob); //创建url对象
            link.download = fileName; //下载后文件名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href); //销毁url对象
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleStruct() {
      console.log(this.selectedRowKeys);
      this.$refs.formHandleStruct.assignMenu(this.selectedRowKeys);
    },
  },
};
</script>
