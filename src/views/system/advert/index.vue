<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="位置名称">
              <a-input v-model="queryParam.dto.name" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="20" :sm="24">
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
        icon="plus"
        v-has="{ perm: 'advert:advert:save' }"
        @click="handleAddOrEdit(0, null)"
        >新增广告位</a-button
      >
    </div>

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
            @click="handleAddOrEdit(1, record)"
            v-has="{ perm: 'advert:advert:update' }"
            >编辑</a-tag
          >
          <a-tag
            color="red"
            @click="handleDelete(record)"
            v-has="{ perm: 'advert:advert:update' }"
            >删除</a-tag
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
      <form-advert ref="fromAdvert" @ok="handleOk" />
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
              $refs.fromAdvert.handleSubmit();
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
import formAdvert from "./form";
import { page, delByPk, down } from "@/api/system/advert";
import { STable } from "@/components";
export default {
  name: "TableList",
  components: {
    STable,
    formAdvert,
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
          title: "广告位名称",
          dataIndex: "name",
        },
        // {
        //   title: "图片预览",
        //   dataIndex: "imgUrl",
        // },
        {
          title: "跳转地址",
          dataIndex: "url",
        },
        {
          title: "显示顺序",
          dataIndex: "orderNum",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          sorter: true,
          needTotal: false,
          customRender: (text) => {
            if (text) {
              return moment(text).format("YYYY-MM-DD");
            }
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          align: "center",
          scopedSlots: {
            customRender: "action",
          },
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
        width: "600",
        placement: "right",
        title: "新建广告位",
      },
    };
  },
  created() {},
  methods: {
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要删除吗?",
        onOk() {
          delByPk({
            pk: record.id,
          })
            .then((response) => {
              if (response.code === 0) {
                that.$message.info(response.message);
                that.$refs.table.refresh();
              } else {
                that.$message.error(response.message);
              }
            })
            .catch((response) => {
              that.$message.warn(response.message);
            });
        },
        onCancel() {},
      });
    },
    handleAddOrEdit(__type, record) {
      this.drawer01.visible = true;
      this.drawer01.title = __type == 0 ? "新增广告位" : "编辑广告位";
      this.$nextTick(() => {
        if (__type == 1) this.$refs.fromAdvert.edit(record);
        else this.$refs.fromAdvert.add();
      });
    },
    handleOk() {
      this.drawer01.visible = false;
      this.$refs.table.refresh();
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
  },
};
</script>
