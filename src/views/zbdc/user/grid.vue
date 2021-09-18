<template>
  <a-modal
    :title="modal.title"
    :width="800"
    :visible="modal.visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-card :bordered="false">
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
              color="green"
              @click="handleSelect(record)"
              v-has="{ perm: 'word:edit' }"
              >选择</a-tag
            >
          </template>
        </span>
      </s-table>
    </a-card>
  </a-modal>
</template>

<script>
import moment from "moment";
import { page } from "@/api/grid";
import { STable } from "@/components";
export default {
  name: "user-grid",
  components: {
    STable,
  },
  props: {},
  data() {
    return {
      modal: {
        title: "选择网格",
        visible: false,
      },
      queryParam: {
        dto: {},
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
          title: "备注",
          dataIndex: "remarks",
        },
        {
          title: "操作",
          dataIndex: "action",
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
    };
  },
  created() {},
  methods: {
    handleSelect(record) {
      this.$emit("selected", record);
    },
    handleSubmit() {
      this.modal.visible = false;
    },
    handleCancel() {
      this.modal.visible = false;
    },
  },
  watch: {},
};
</script>
