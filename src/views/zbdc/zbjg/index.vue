<template>
  <a-card :bordered="false">
    <template>
      <div class="table-operator">
        <a-button
          type="primary"
          icon="plus"
          v-has="{ perm: 'party:save' }"
          @click="handleForm(0, null)"
          >添加机构</a-button
        >
      </div>
    </template>
    <div class="table-page-search-wrapper">
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :scroll="{ x: 1300 }"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a-tag
              color="orange"
              @click="handleForm(1, record)"
              v-has="{ perm: 'party:update' }"
              >编辑</a-tag
            >
            <a-tag
              color="red"
              @click="handleDelete(record)"
              v-has="{ perm: 'party:delete' }"
              >删除</a-tag
            >
            <a-tag
              color="#87d068"
              @click="handleBind(record)"
              v-has="{ perm: 'party:bind' }"
              >党员绑定</a-tag
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
        <form-struct ref="formStruct" @ok="handleOk" />
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
                $refs.formStruct.handleSubmit();
              }
            "
            >确定</a-button
          >
        </div>
      </a-drawer>
    </div>
    <!--村民选择-->
    <a-modal
      width="900px"
      v-if="modal01.visible"
      :title="modal01.title"
      :visible="modal01.visible"
      :confirm-loading="modal01.loading"
      @cancel="modal01.visible = false"
      @ok="modal01.visible = false"
    >
      <bind-user ref="bindUser" @bind="handleUserBindConfirm"></bind-user>
    </a-modal>
  </a-card>
</template>

<script>
import { page, delByPk, bind } from "@/api/system/party";
import { STable } from "@/components";
import formStruct from "./form";
import moment from "moment";
import bindUser from "./modal";
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "创建时间",
    dataIndex: "gmtCreate",
    customRender: (text) => {
      if (text) return moment(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "操作",
    dataIndex: "",
    key: "x",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  data() {
    return {
      columns,
      queryParam: {
        dto: {},
      },
      drawer01: {
        visible: false,
        width: "450",
        placement: "right",
        title: "添加党支部",
      },
      modal01: {
        visible: false,
        loading: false,
        title: "选择村民",
      },
      loadData: (parameter) => {
        return page(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
    };
  },
  components: {
    formStruct,
    bindUser,
    STable,
  },
  created() {},
  methods: {
    handleForm(__type, __record) {
      this.drawer01.visible = true;
      this.drawer01.title = __type == 0 ? "添加支部架构" : "编辑支部架构";
      this.$nextTick(() => {
        if (__type == 1) this.$refs.formStruct.edit(__record);
        else this.$refs.formStruct.add(__record);
      });
    },
    handleAssign(record) {
      this.$refs.formHandleOrg.assignColumn(record);
    },
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要删除吗?",
        onOk() {
          delByPk({ id: record.id }).then((response) => {
            if (response.code === 0) {
              that.$message.info(response.message);
              that.handleOk();
            } else {
              that.$message.error(response.message);
            }
          });
        },
        onCancel() {},
      });
    },
    handleOk() {
      this.drawer01.visible = false;
      this.$refs.table.refresh();
    },
    handleBind(__record) {
      if (__record) {
        this.modal01.visible = true;
        this.modal01.title = "选择党员绑定至党支部【" + __record.name + "】";
        this.$nextTick(() => {
          this.$refs.bindUser.queryParam.dto.foreignId = __record.id;
        });
      }
    },
    handleUserBindConfirm(__data) {
      bind(__data).then((response) => {
        if (response.code === 0 && response.res) {
          this.$message.info(response.message);
          this.$refs.bindUser.refreshTable();
        } else {
          this.$message.error("操作失败");
        }
      });
    },
  },
};
</script>
